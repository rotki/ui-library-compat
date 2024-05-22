<script lang="ts" setup>
import { logicAnd, logicOr } from '@vueuse/math';
import RuiButton from '@/components/buttons/button/Button.vue';
import RuiIcon from '@/components/icons/Icon.vue';
import RuiChip from '@/components/chips/Chip.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/Menu.vue';
import type { Ref } from 'vue';

export type T = any;

export type K = string;

export type ModelValue<MV> = MV | MV[] | null;

export interface Props<T> {
  options: T[];
  keyAttr?: K;
  textAttr?: K;
  value?: ModelValue<T>;
  disabled?: boolean;
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
  searchInput?: string;
  noFilter?: boolean;
  filter?: (item: T, queryText: string) => boolean;
}

defineOptions({
  name: 'RuiAutoComplete',
});

const props = withDefaults(defineProps<Props<T>>(), {
  disabled: false,
  readOnly: false,
  dense: false,
  clearable: false,
  hideDetails: false,
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
});

const emit = defineEmits<{
  (e: 'input', value: ModelValue<T>): void;
  (e: 'update:search-input', search: string): void;
}>();

const css = useCssModule();
const attrs = useAttrs();

const { dense, variant, disabled, options } = toRefs(props);

const textInput = ref();
const activator = ref();
const menuRef = ref();

const multiple = computed(() => Array.isArray(props.value));

const { focused: searchInputFocused } = useFocus(textInput);

const internalSearch: Ref<string> = ref('');
const debouncedInternalSearch = refDebounced(internalSearch, 200);

const searchInputModel = useVModel(props, 'searchInput', emit, {
  eventName: 'update:search-input',
});

watchImmediate(searchInputModel, (search) => {
  set(internalSearch, search);
});

const filteredOptions = computed(() => {
  const search = get(debouncedInternalSearch);
  const optionsVal = get(options);
  if (props.noFilter || !search)
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

function input(value: ModelValue<T>) {
  emit('input', value);
}

const value = computed<(T extends string ? T : Record<K, T>)[]>({
  get: () => {
    const value = props.value;
    const keyAttr = props.keyAttr;
    const valueToArray = value ? (Array.isArray(value) ? value : [value]) : [];

    if (keyAttr)
      return get(options).filter(item => valueToArray.includes(item[keyAttr]));

    return valueToArray;
  },
  set: (selected: T[]) => {
    const keyAttr = props.keyAttr;
    const selection = keyAttr ? selected.map(item => item[keyAttr]) : selected;

    if (get(multiple))
      return input(selection);

    if (selection.length === 0)
      return input(null);

    return input(selection[0]);
  },
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
  getText,
  getIdentifier,
  isActiveItem,
  itemIndexInValue,
  highlightedIndex,
  moveHighlight,
  applyHighlighted,
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
}

function setValue(val: T, index?: number) {
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
    updateInternalSearch();
    set(value, [val]);
  }

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

function moveSelectedValueHighlight(next: boolean) {
  if (!get(multiple))
    return;

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
const { focused: menuFocusedWithin } = useFocusWithin(containerProps.ref);
const anyFocused = logicOr(activatorFocusedWithin, menuFocusedWithin);

// Close menu if the activator is not focused anymore
watch(anyFocused, (focused) => {
  if (!focused) {
    set(isOpen, false);
    updateInternalSearch();
  }
});

function onInputFocused() {
  set(isOpen, true);
  set(focusedValueIndex, -1);
}

function clear() {
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
          v-on="readOnly ? {} : on"
          @click="setInputFocus()"
          @focus="setInputFocus()"
          @keydown.enter="applyHighlighted()"
          @keydown.left.prevent="moveSelectedValueHighlight(false)"
          @keydown.right.prevent="moveSelectedValueHighlight(true)"
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
                v-if="multiple"
                :key="getIdentifier(item)"
                tabindex="-1"
                :size="dense ? 'sm' : 'md'"
                :data-value="getIdentifier(item)"
                closeable
                clickable
                @keydown.delete="setValue(item)"
                @click.stop="setValueFocus(i)"
                @click:close="setValue(item)"
              >
                <div
                  :key="i"
                  class="flex"
                >
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
                v-else
                :key="getIdentifier(item)"
                class="flex"
              >
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
            </template>
            <input
              ref="textInput"
              :disabled="disabled"
              :value="internalSearch"
              class="bg-transparent outline-none min-w-[4rem] flex-1"
              type="text"
              :class="{ '!w-0 !min-w-0': !anyFocused }"
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

          <span :class="css.icon__wrapper">
            <RuiIcon
              :class="[css.icon, { 'rotate-180': open }]"
              :size="dense ? 24 : 32"
              name="arrow-drop-down-fill"
            />
          </span>
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
        :class="[css.menu, menuClass]"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
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
            :key="index"
            :active="isActiveItem(item)"
            :size="dense ? 'sm' : undefined"
            :value="getIdentifier(item)"
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
      @apply py-1 min-h-10;

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
          @apply border-black/[0.23] #{!important};
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
      @apply flex gap-1 flex-wrap;
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
