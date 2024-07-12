<script lang="ts" setup>
import { logicAnd, logicOr } from '@vueuse/math';
import { objectOmit } from '@vueuse/shared';
import RuiButton from '@/components/buttons/button/Button.vue';
import RuiIcon from '@/components/icons/Icon.vue';
import RuiChip from '@/components/chips/Chip.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/Menu.vue';
import RuiProgress from '@/components/progress/Progress.vue';

export type T = any;

export type K = string;

export type ModelValue = T | T[] | T[K] | null;

export interface Props<T> {
  options?: T[];
  keyAttr?: K;
  textAttr?: K;
  value?: ModelValue;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  menuOptions?: MenuProps;
  labelClass?: string;
  menuClass?: string;
  itemClass?: string;
  prependWidth?: number; // in rem
  appendWidth?: number; // in rem
  itemHeight?: number; // in px
  variant?: 'default' | 'filled' | 'outlined';
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  autoSelectFirst?: boolean;
  chips?: boolean;
  searchInput?: string;
  noFilter?: boolean;
  hideNoData?: boolean;
  noDataText?: string;
  filter?: (item: T, queryText: string) => boolean;
  hideSelected?: boolean;
  placeholder?: string;
  returnObject?: boolean;
  customValue?: boolean;
}

defineOptions({
  name: 'RuiAutoComplete',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props<T>>(), {
  options: () => [],
  disabled: false,
  loading: false,
  readOnly: false,
  dense: false,
  clearable: false,
  hideDetails: false,
  chips: false,
  label: 'Select',
  prependWidth: 0,
  appendWidth: 0,
  variant: 'default',
  hint: undefined,
  keyAttr: undefined,
  textAttr: undefined,
  itemHeight: undefined,
  errorMessages: () => [],
  successMessages: () => [],
  autoSelectFirst: false,
  searchInput: '',
  noFilter: false,
  hideNoData: false,
  noDataText: 'No data available',
  hideSelected: false,
  returnObject: false,
  customValue: false,
});

const emit = defineEmits<{
  (e: 'input', value: ModelValue): void;
  (e: 'update:search-input', search: string): void;
}>();

const css = useCssModule();
const attrs = useAttrs();
const slots = useSlots();

const { dense, variant, disabled, options } = toRefs(props);

const {
  getText,
  getIdentifier,
} = useDropdownOptionProperty<T, K>(
  {
    keyAttr: props.keyAttr,
    textAttr: props.textAttr,
  },
);

const textInput = ref();
const activator = ref();
const noDataContainer = ref();
const menuRef = ref();

const multiple = computed(() => Array.isArray(props.value));

const shouldApplyValueAsSearch = computed(() => !(slots.selection || get(multiple) || props.chips));

const { focused: searchInputFocused } = useFocus(textInput);

const internalSearch: Ref<string> = ref('');
const debouncedInternalSearch = refDebounced(internalSearch, 100);

const searchInputModel = useVModel(props, 'searchInput', emit, {
  eventName: 'update:search-input',
});

watchImmediate(searchInputModel, (search) => {
  set(internalSearch, search);
});

const justOpened = ref(false);

const filteredOptions = computed(() => {
  const search = get(debouncedInternalSearch);
  const optionsVal = get(options);
  if (props.noFilter || !search || get(justOpened))
    return optionsVal;

  const keyAttr = props.keyAttr;
  const textAttr = props.textAttr;

  const usedFilter = props.filter || ((item, search) => {
    const keywords = [keyAttr ? item[keyAttr] : item.toString()];

    if (textAttr && typeof item === 'object')
      keywords.push(item[textAttr]);

    return keywords.some(keyword => getTextToken(keyword).includes(getTextToken(search)));
  });

  return optionsVal.filter(item => usedFilter(item, search));
});

function input(value: ModelValue) {
  emit('input', value);
}

function setSelected(selected: T[]) {
  const keyAttr = props.keyAttr;
  const selection = keyAttr && !props.returnObject ? selected.map(item => item[keyAttr]) : selected;

  if (get(multiple))
    return input(selection);

  if (selection.length === 0)
    return input(null);

  return input(selection[0]);
}

const value = computed<(T extends string ? T : Record<K, T>)[]>({
  get: () => {
    const value = props.value;
    const keyAttr = props.keyAttr;
    const multipleVal = get(multiple);
    const valueToArray = value ? (Array.isArray(value) ? value : [value]) : [];
    const optionsVal = get(options);

    if (keyAttr && !props.returnObject) {
      const filtered: T[] = [];
      valueToArray.forEach((val) => {
        const inOptions = optionsVal.find(item => getIdentifier(item) === val);

        if (inOptions)
          return filtered.push(inOptions);
        if (props.customValue)
          return filtered.push(textValueToProperValue(val));
      });

      if (multipleVal || filtered.length === 0) {
        if (get(shouldApplyValueAsSearch) && !get(searchInputFocused))
          updateInternalSearch();

        return filtered;
      }
      else {
        const val = filtered[0];
        if (get(shouldApplyValueAsSearch) && !get(searchInputFocused))
          updateInternalSearch(getText(val));

        return [val];
      }
    }

    const filtered: T[] = [];
    valueToArray.forEach((val) => {
      const inOptions = optionsVal.find(item => getIdentifier(item) === getIdentifier(val));

      if (inOptions)
        return filtered.push(inOptions);
      if (props.customValue)
        return filtered.push(val);
    });

    if (get(shouldApplyValueAsSearch) && !get(searchInputFocused)) {
      if (filtered.length > 0)
        updateInternalSearch(filtered[0]);
      else
        updateInternalSearch();
    }

    return filtered;
  },
  set: (selected: T[]) => {
    setSelected(selected);
  },
});

watch(options, (curr, old) => {
  if (isEqual(curr, old) || props.customValue)
    return;

  setSelected(get(value));
});

const valueSet = computed(() => get(value).length > 0);

const labelWithQuote = computed(() => {
  if (!props.label)
    return '"\\200B"';

  return `'  ${props.label}  '`;
});

const {
  containerProps,
  wrapperProps,
  renderedData,
  isOpen,
  menuWidth,
  isActiveItem,
  itemIndexInValue,
  highlightedIndex,
  moveHighlight,
  applyHighlighted,
  optionsWithSelectedHidden,
} = useDropdownMenu<T, K>({
  itemHeight: props.itemHeight ?? (props.dense ? 30 : 48),
  keyAttr: props.keyAttr,
  textAttr: props.textAttr,
  options: filteredOptions,
  dense,
  value,
  menuRef,
  setValue,
  autoSelectFirst: props.autoSelectFirst,
  hideSelected: props.hideSelected,

});

const outlined = computed(() => get(variant) === 'outlined');

const float = logicAnd(
  logicOr(
    isOpen,
    valueSet,
    searchInputFocused,
  ),
  outlined,
);

const virtualContainerProps = computed(() => ({
  style: containerProps.style as any,
  ref: containerProps.ref as any,
}));

function updateInternalSearch(value: string = '') {
  set(searchInputModel, value);
  set(internalSearch, value);
}

function updateSearchInput(event: any) {
  const value = event.target.value;
  set(isOpen, true);
  updateInternalSearch(value);
  set(justOpened, false);
}

function setValue(val: T, index?: number, skipRefocused = false) {
  if (isDefined(index))
    set(highlightedIndex, index);

  if (get(multiple)) {
    const newValue = [...get(value)];
    const indexInValue = itemIndexInValue(val);
    if (indexInValue === -1) {
      updateInternalSearch();
      newValue.push(val);
    }

    else { newValue.splice(indexInValue, 1); }
    set(value, newValue);
  }
  else {
    nextTick(() => {
      set(isOpen, false);
    });
    if (get(shouldApplyValueAsSearch))
      updateInternalSearch(getText(val));
    else
      updateInternalSearch();

    set(value, [val]);
  }

  if (!skipRefocused)
    set(searchInputFocused, true);
}

function setInputFocus() {
  nextTick(() => {
    set(searchInputFocused, true);
  });
}

const focusedValueIndex: Ref<number> = ref(-1);

function setValueFocus(index: number) {
  set(focusedValueIndex, index);
}

watch(value, () => {
  set(focusedValueIndex, -1);
});

watch(focusedValueIndex, (index) => {
  if (index === -1 || !get(multiple))
    return;

  nextTick(() => {
    const keyAttr = props.keyAttr;
    const entry = get(value)[index];
    const data = keyAttr ? entry[keyAttr] : entry;
    const activeChip = get(activator).querySelector(`[data-value="${data}"]`);
    activeChip?.focus();
  });
});

function moveSelectedValueHighlight(event: KeyboardEvent, next: boolean) {
  if (!get(multiple) || get(internalSearch).length > 0)
    return;

  event.preventDefault();
  const total = get(value).length;

  let current = get(focusedValueIndex);

  if (current === -1) {
    set(focusedValueIndex, next ? 0 : total - 1);
    return;
  }

  const move = next ? 1 : -1;
  current += move;

  if (current < 0 || current >= total) {
    set(focusedValueIndex, -1);
    set(searchInputFocused, true);
  }
  else {
    set(focusedValueIndex, current);
  }
}

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: noDataContainerFocusedWithin } = useFocusWithin(noDataContainer);
const { focused: menuFocusedWithin } = useFocusWithin(containerProps.ref);
const anyFocused = logicOr(activatorFocusedWithin, noDataContainerFocusedWithin, menuFocusedWithin);

function textValueToProperValue(val: any): T {
  const keyAttr = props.keyAttr;
  if (!keyAttr)
    return val;

  const newValue = {
    [keyAttr]: val,
  };

  const textAttr = props.textAttr;

  if (textAttr)
    newValue[textAttr] = val;

  return newValue;
}

function setSearchAsValue() {
  const searchToBeValue = get(internalSearch);
  if (!searchToBeValue)
    return;

  const newValue: T = textValueToProperValue(searchToBeValue);
  setValue(newValue, undefined, true);
}

// Close menu if the activator is not focused anymore
watch(anyFocused, (focused) => {
  if (!focused) {
    set(isOpen, false);
    if (props.customValue && get(filteredOptions).length === 0 && get(internalSearch))
      setSearchAsValue();

    if (!get(shouldApplyValueAsSearch))
      updateInternalSearch();
  }
});

function onInputFocused() {
  set(focusedValueIndex, -1);
  if (get(shouldApplyValueAsSearch))
    get(textInput)?.select();

  set(justOpened, true);
}

function clear() {
  updateInternalSearch();
  emit('input', Array.isArray(props.value) ? [] : null);
}

function onInputDeletePressed() {
  const total = get(value).length;
  if (!get(internalSearch) && total > 0) {
    if (get(multiple))
      set(focusedValueIndex, total - 1);

    else
      clear();
  }
}

function chipAttrs(item: (T extends string ? T : Record<K, T>)) {
  return {
    'data-value': getIdentifier(item),
  };
}

function chipListener(item: (T extends string ? T : Record<K, T>), index: number) {
  return {
    'keydown': (event: KeyboardEvent) => {
      const { key } = event;
      if (['Backspace', 'Delete'].includes(key))
        setValue(item);
    },
    'click.stop': () => setValueFocus(index),
    'click:close': () => setValue(item),
  };
}

function onEnter(event: KeyboardEvent) {
  if (get(filteredOptions).length > 0 && get(highlightedIndex) > -1 && get(isOpen)) {
    applyHighlighted();
    event.preventDefault();
  }
  else if (get(options).length > 0 && props.customValue) {
    setSearchAsValue();
    if (!get(multiple))
      set(isOpen, false);
    event.preventDefault();
  }
  else if (!get(isOpen) && get(value).length === 0) {
    set(isOpen, true);
    event.preventDefault();
  }
}

function onTab(event: KeyboardEvent) {
  if (get(isOpen) && get(filteredOptions).length > 0 && get(highlightedIndex) > -1 && !get(multiple)) {
    applyHighlighted();
    event.preventDefault();
  }
}

function getListeners(on: Record<string, Function | undefined>, $listeners: Record<string, Function | Function[]>) {
  const listenersFiltered = objectOmit($listeners, ['input']);

  return {
    ...(props.readOnly ? {} : on),
    ...listenersFiltered,
  };
}

function setSelectionRange(start: number, end: number) {
  set(searchInputFocused, true);
  get(textInput)?.setSelectionRange?.(start, end);
}

const inputClass: ComputedRef<string> = computed(() => {
  if ((!get(anyFocused) || get(disabled)) && !get(shouldApplyValueAsSearch))
    return 'w-0 h-0';

  if (get(internalSearch))
    return 'flex-1 min-w-[4rem]';

  return 'flex-1 min-w-0';
});

function arrowClicked(event: any) {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

const renderedOptions = ref([]);

const menuMinHeight: ComputedRef<number> = computed(() => {
  const renderedOptionsData = get(renderedOptions).slice(0, 5);
  return renderedOptionsData.reduce((currentValue, item: typeof RuiButton) => currentValue + item.$el.offsetHeight, 0);
});

defineExpose({
  focus: setInputFocus,
  setSelectionRange,
});
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="css.wrapper"
    v-bind="{
      placement: 'bottom-start',
      closeOnContentClick: false,
      fullWidth: true,
      persistOnActivatorClick: true,
      ...menuOptions,
      menuClass: [
        { hidden: (optionsWithSelectedHidden.length === 0 && customValue && !slots['no-data']) },
        menuOptions?.menuClass,
      ],
      errorMessages,
      successMessages,
      hint,
      dense,
      showDetails: !hideDetails,
      disabled,
    }"
  >
    <template #activator="{ on, open, hasError, hasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, variant, readOnly, on, open, hasError, hasSuccess }"
      >
        <div
          ref="activator"
          class="group"
          :class="[
            css.activator,
            labelClass,
            {
              [css.disabled]: disabled,
              [css.readonly]: readOnly,
              [css.outlined]: outlined,
              [css.dense]: dense,
              [css.float]: float,
              [css.opened]: open,
              [css['with-value']]: valueSet,
              [css['with-error']]: hasError,
              [css['with-success']]: hasSuccess && !hasError,
            },
          ]"
          v-bind="attrs"
          data-id="activator"
          :tabindex="disabled || readOnly ? -1 : 0"
          v-on="
            // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
            getListeners(on, $listeners)
          "
          @click="setInputFocus()"
          @focus="setInputFocus()"
          @keydown.enter="onEnter($event)"
          @keydown.tab="onTab($event)"
          @keydown.left="moveSelectedValueHighlight($event, false)"
          @keydown.right="moveSelectedValueHighlight($event, true)"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
        >
          <span
            v-if="outlined || (!valueSet && !searchInputFocused)"
            :class="[
              css.label,
              {
                'absolute': outlined,
                'pr-2': !valueSet && !open && outlined,
              },
            ]"
          >
            <slot
              name="activator.label"
              v-bind="{ value }"
            >
              {{ label }}
            </slot>
          </span>
          <div :class="css.value">
            <template v-for="(item, i) in value">
              <RuiChip
                v-if="chips"
                :key="getIdentifier(item)"
                tabindex="-1"
                :size="dense ? 'sm' : 'md'"
                closeable
                :class="{ 'leading-3': dense }"
                clickable
                v-bind="chipAttrs(item)"
                v-on="chipListener(item, i)"
              >
                <div class="flex">
                  <slot
                    name="selection.prepend"
                    :index="i"
                    v-bind="{ item }"
                  />
                  <slot
                    :index="i"
                    name="selection"
                    v-bind="{ item }"
                  >
                    {{ getText(item) }}
                  </slot>
                </div>
              </RuiChip>
              <div
                v-else-if="multiple || slots['selection.prepend'] || slots.selection"
                :key="getIdentifier(item)"
                class="flex"
              >
                <slot
                  name="selection.prepend"
                  :index="i"
                  v-bind="{ item }"
                />
                <slot
                  v-if="multiple || slots.selection"
                  :index="i"
                  name="selection"
                  v-bind="{ item, chipAttrs: chipAttrs(item), chipOn: chipListener(item, i) }"
                >
                  {{ getText(item) }}
                </slot>
              </div>
            </template>
            <input
              ref="textInput"
              :disabled="disabled"
              :value="internalSearch"
              class="bg-transparent outline-none"
              type="text"
              :placeholder="placeholder"
              :class="inputClass"
              @keydown.delete="onInputDeletePressed()"
              @input="updateSearchInput($event)"
              @focus="onInputFocused()"
            />
          </div>

          <span
            v-if="clearable && valueSet && !disabled"
            class="group-hover:!visible"
            :class="[css.clear, anyFocused && '!visible']"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              color="error"
              name="close-line"
              size="18"
            />
          </span>

          <span
            :class="css.icon__wrapper"
            @click="arrowClicked($event)"
          >
            <RuiIcon
              :class="[css.icon, { 'rotate-180': open }]"
              :size="dense ? 24 : 32"
              name="arrow-drop-down-fill"
            />
          </span>

          <RuiProgress
            v-if="loading"
            class="absolute left-0 bottom-0 w-full"
            color="primary"
            thickness="3"
            variant="indeterminate"
          />
        </div>
        <fieldset
          v-if="outlined"
          :class="css.fieldset"
        >
          <legend :class="{ 'px-2': float }" />
        </fieldset>
      </slot>
    </template>
    <template #default="{ width }">
      <div
        v-if="optionsWithSelectedHidden.length > 0"
        :class="[css.menu, menuClass]"
        :style="{ width: `${width}px`, minWidth: menuWidth, minHeight: `${menuMinHeight}px` }"
        v-bind="virtualContainerProps"
        @scroll="containerProps.onScroll"
        @keydown.up.prevent="moveHighlight(true)"
        @keydown.down.prevent="moveHighlight(false)"
      >
        <div
          v-bind="wrapperProps"
          ref="menuRef"
        >
          <RuiButton
            v-for="({ item, index }) in renderedData"
            ref="renderedOptions"
            :key="getIdentifier(item)"
            :active="isActiveItem(item)"
            :size="dense ? 'sm' : undefined"
            :value="getIdentifier(item)"
            tabindex="0"
            variant="list"
            :class="{
              highlighted: highlightedIndex === index,
              [css.highlighted]: highlightedIndex === index,
              [css.active]: isActiveItem(item),
            }"
            @input="setValue(item, index)"
            @mousedown="highlightedIndex = index"
          >
            <template #prepend>
              <slot
                name="item.prepend"
                v-bind="{ disabled, item, active: isActiveItem(item) }"
              />
            </template>
            <slot
              name="item"
              v-bind="{ disabled, item, active: isActiveItem(item) }"
            >
              {{ getText(item) }}
            </slot>
            <template #append>
              <slot
                name="item.append"
                v-bind="{ disabled, item, active: isActiveItem(item) }"
              />
            </template>
          </RuiButton>
        </div>
      </div>

      <div
        v-else-if="!hideNoData"
        ref="noDataContainer"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        :class="menuClass"
      >
        <slot name="no-data">
          <div
            v-if="!customValue"
            class="p-4"
          >
            {{ noDataText }}
          </div>
        </slot>
      </div>
    </template>
  </RuiMenu>
</template>

<style lang="scss" module>
.wrapper {
  @apply w-full inline-flex flex-col;

  .activator {
    @apply relative inline-flex items-center w-full;
    @apply outline-none focus-within:outline-none cursor-pointer min-h-14 pl-3 py-2 pr-8 rounded;
    @apply m-0 bg-white transition-all text-body-1 text-left hover:border-black;

    &:not(.outlined) {
      @apply hover:bg-gray-100 focus-within:bg-gray-100;
    }

    &.dense {
      @apply py-1.5 min-h-10;

      ~ .fieldset {
        @apply px-2;
      }
    }

    &.disabled {
      @apply opacity-65 text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none;
    }

    &.readonly {
      @apply opacity-80 pointer-events-none cursor-default bg-gray-50;
    }

    &.outlined {
      @apply border-none hover:border-none;

      &.opened,
      &:focus,
      &:focus-within {
        @apply border-rui-primary;

        ~ .fieldset {
          @apply border-rui-primary #{!important};
          @apply border-2 #{!important};
        }
      }

      ~ .fieldset {
        @apply border border-black/[0.23];
      }

      &:hover {
        ~ .fieldset {
          @apply border-black;
        }
      }

      &.disabled {
        ~ .fieldset {
          @apply border-dotted;
          @apply border border-black/[0.23] #{!important};
        }
      }

      &.with-success {
        .label {
          @apply text-rui-success #{!important};
        }

        ~ .fieldset {
          @apply border-rui-success #{!important};
        }
      }

      &.with-error {
        .label {
          @apply text-rui-error #{!important};
        }

        ~ .fieldset {
          @apply border-rui-error #{!important};
        }
      }
    }

    .label {
      @apply text-rui-text-secondary;
      max-width: calc(100% - 2.5rem);
    }

    .label,
    .value {
      @apply block truncate transition-all duration-75;
    }

    .value {
      @apply flex gap-1 flex-wrap flex-1;
    }

    .clear {
      @apply ml-auto shrink-0 invisible;
    }

    .icon {
      @apply text-rui-text transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute right-1 top-px bottom-0;
      }
    }

    &.float {
      .label {
        @apply -translate-y-2 top-0 text-xs px-1;
      }

      ~ .fieldset {
        legend {
          &:after {
            content: v-bind(labelWithQuote);
          }
        }
      }

      &.opened,
      &.opened.with-value,
      &:focus,
      &:focus.with-value,
      &:focus-within,
      &:focus-within.with-value {
        .label {
          @apply text-rui-primary;
        }

        ~ .fieldset {
          @apply border-rui-primary;
          @apply border-2 #{!important};
        }
      }
    }
  }

  .fieldset {
    @apply absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0 rounded pointer-events-none px-2 transition-all -mt-2;

    legend {
      @apply opacity-0 text-xs truncate;
      max-width: calc(100% - 1rem);

      &:before {
        content: ' ';
      }

      &:after {
        @apply truncate max-w-full leading-[0];
        content: '\200B';
      }
    }
  }
}

.menu {
  @apply overflow-y-auto max-h-60 min-w-[2.5rem];
}

.highlighted {
  @apply bg-rui-grey-200 #{!important};

  &.active {
    @apply bg-rui-grey-300 #{!important};
  }
}

:global(.dark) {
  .wrapper {
    .activator {
      @apply bg-transparent text-rui-text;

      &:not(.outlined) {
        @apply hover:bg-white/10 focus-within:bg-white/10;

        &.disabled {
          @apply bg-white/10;
        }
      }

      &.readonly {
        @apply bg-white/10;
      }

      &.outlined {
        ~ .fieldset {
          @apply border-white/[0.23];
        }

        &.disabled {
          ~ .fieldset {
            @apply border-white/[0.23] #{!important};
          }
        }

        &:hover {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }

  .highlighted {
    @apply bg-rui-grey-800 #{!important};

    &.active {
      @apply bg-rui-grey-700 #{!important};
    }
  }
}
</style>
