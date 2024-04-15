<script lang="ts" setup>
import { useRoute } from 'vue-router/composables';
import { throttleFilter } from '@vueuse/shared';
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import VRender from '@/components/VRender';
import type { ContextColorsType } from '@/consts/colors';
import type { TabProps } from '@/components/tabs/tab/Tab.vue';

export interface Props {
  color?: ContextColorsType;
  vertical?: boolean;
  disabled?: boolean;
  grow?: boolean;
  value?: number | string;
  align?: 'start' | 'center' | 'end';
}

defineOptions({
  name: 'RuiTabs',
});

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  vertical: false,
  disabled: false,
  grow: false,
  value: undefined,
  align: 'center',
});

const emit = defineEmits<{
  (e: 'input', value: number | string): void;
}>();

const { color, grow, value, disabled, vertical, align } = toRefs(props);

const internalValue = ref();

const slots = useSlots();
const children = computed(() => {
  const tabs = slots.default?.() ?? [];
  const currentValue = get(internalValue);
  const inheritedProps = {
    color: get(color),
    grow: get(grow),
    disabled: get(disabled),
    vertical: get(vertical),
    align: get(align),
  };

  return tabs
    .filter(tab => !!tab.tag)
    .map((tab, index) => {
      // @ts-expect-error the typings throw a false error
      // The componentOptions.propsData is messed when combined with props from the parent.
      // So use `initialPropsData`, the original `propsData` that haven't touched by the code below.
      const propsData = (tab.componentOptions?.initialPropsData
        || tab.componentOptions?.propsData
        || {}) as TabProps;

      let tabValue: string | number = propsData?.tabValue ?? index;
      if (propsData.link !== false && propsData.to)
        tabValue = propsData.to;

      const active = currentValue === tabValue;

      const newProps = {
        ...inheritedProps,
        ...propsData,
        tabValue,
        active,
      };

      return {
        node: tab,
        props: newProps,
      };
    });
});

function updateValue(newValue: string | number) {
  emit('input', newValue);
  set(internalValue, newValue);
}

const route = useRoute();

function isPathMatch(path: string, {
  exactPath,
  exact,
}: {
  exactPath?: boolean;
  exact?: boolean;
}) {
  const currentRoute = route.fullPath;

  if (exactPath)
    return currentRoute === path;

  const routeWithoutQueryParams = new URL(path, window.location.origin)
    .pathname;

  if (exact)
    return currentRoute === routeWithoutQueryParams;

  return currentRoute.startsWith(routeWithoutQueryParams);
}

function keepActiveTabVisible() {
  nextTick(() => {
    if (!get(showArrows))
      return;

    const elem = get(wrapper);
    const barElem = get(bar);
    if (elem) {
      const activeTab = (elem.querySelector('.active-tab')
        ?? elem.querySelector('.active-tab-link')) as HTMLElement;

      if (!activeTab || !barElem)
        return;

      const childLeft = activeTab.offsetLeft - elem.offsetLeft;
      const childTop = activeTab.offsetTop - elem.offsetTop;
      const childWidth = activeTab.offsetWidth;
      const childHeight = activeTab.offsetHeight;
      const parentScrollLeft = barElem.scrollLeft;
      const parentScrollTop = barElem.scrollTop;
      const parentWidth = barElem.offsetWidth;
      const parentHeight = barElem.offsetHeight;

      const scrollLeft = Math.max(
        Math.min(parentScrollLeft, childLeft),
        childLeft + childWidth - parentWidth,
      );

      const scrollTop = Math.max(
        Math.min(parentScrollTop, childTop),
        childTop + childHeight - parentHeight,
      );

      barElem.scrollTo({
        left: scrollLeft,
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  });
}

function applyNewValue(onlyLink = false) {
  const enabledChildren = get(children).filter(
    child => !(child.node.componentOptions?.propsData as TabProps).disabled,
  );
  if (enabledChildren.length > 0) {
    let newValue: string | number = get(value) || 0;
    enabledChildren.forEach((child, index) => {
      const props = child.node.componentOptions?.propsData as TabProps;
      if (!onlyLink && index === 0 && props.tabValue)
        newValue = props.tabValue;

      if (props.link !== false && props.to && isPathMatch(props.to, props))
        newValue = props.to;
    });
    updateValue(newValue);
  }
  keepActiveTabVisible();
}

onMounted(() => {
  if (get(value) !== undefined)
    return;

  applyNewValue();
});

watch(route, () => {
  applyNewValue(true);
});

const css = useCssModule();

const bar = ref<HTMLDivElement>();
const wrapper = ref<HTMLDivElement>();

const { width, height } = useElementSize(bar);
const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapper);
const { arrivedState, x, y } = useScroll(bar, { behavior: 'smooth' });

const { top, bottom, left, right } = toRefs(arrivedState);

const showArrows: Ref<boolean> = ref(false);
const { trigger: triggerHorizontal, stop: stopHorizontal } = watchTriggerable(
  [wrapperWidth, width],
  ([ww, w]) => {
    set(showArrows, ww > w);
  },
  {
    eventFilter: throttleFilter(50),
  },
);

const { trigger: triggerVertical, stop: stopVertical } = watchTriggerable(
  [wrapperHeight, height],
  ([wh, h]) => {
    set(showArrows, wh > h);
  },
  {
    eventFilter: throttleFilter(500),
  },
);

watchImmediate(vertical, (vertical) => {
  if (vertical) {
    triggerVertical();
    stopHorizontal();
  }
  else {
    triggerHorizontal();
    stopVertical();
  }
});

const prevArrowDisabled = computed(() => {
  if (!get(vertical))
    return get(left);

  return get(top);
});

const nextArrowDisabled = computed(() => {
  if (!get(vertical))
    return get(right);

  return get(bottom);
});

function onPrevSliderClick() {
  if (!get(vertical))
    set(x, get(x) - get(width));
  else
    set(y, get(y) - get(height));
}

function onNextSliderClick() {
  if (!get(vertical))
    set(x, get(x) + get(width));
  else
    set(y, get(y) + get(height));
}

useResizeObserver(bar, () => {
  keepActiveTabVisible();
});

watchImmediate(value, (value) => {
  set(internalValue, value);
});

watch(internalValue, () => {
  keepActiveTabVisible();
});
</script>

<template>
  <div :class="[css.tabs, { [css['tabs--vertical']]: vertical }]">
    <div
      v-if="showArrows"
      :class="[css.arrow, { [css['arrow--vertical']]: vertical }]"
    >
      <Button
        :color="color"
        :disabled="prevArrowDisabled"
        class="w-full h-full !rounded-none"
        variant="text"
        @click="onPrevSliderClick()"
      >
        <Icon :name="vertical ? 'arrow-up-s-line' : 'arrow-left-s-line'" />
      </Button>
    </div>
    <div
      ref="bar"
      :class="[
        css['tabs-bar'],
        { [css['tabs-bar--vertical']]: vertical },
        { [css['tabs-bar--grow']]: grow },
      ]"
      class="no-scrollbar"
    >
      <div
        ref="wrapper"
        :class="[
          css['tabs-wrapper'],
          { [css['tabs-wrapper--vertical']]: vertical },
          { [css['tabs-wrapper--grow']]: grow },
        ]"
        role="tablist"
      >
        <VRender
          v-for="(child, i) in children"
          :key="i"
          :v-node="child.node"
          v-bind="child.props"
          @click="updateValue($event)"
        />
      </div>
    </div>
    <div
      v-if="showArrows"
      :class="[css.arrow, { [css['arrow--vertical']]: vertical }]"
    >
      <Button
        :color="color"
        :disabled="nextArrowDisabled"
        class="w-full h-full !rounded-none"
        variant="text"
        @click="onNextSliderClick()"
      >
        <Icon :name="vertical ? 'arrow-down-s-line' : 'arrow-right-s-line'" />
      </Button>
    </div>
  </div>
</template>

<style lang="scss" module>
.tabs {
  @apply flex h-[2.625rem];

  &--vertical {
    @apply h-auto max-h-full flex-col;
  }

  &-bar {
    @apply max-h-full overflow-auto;

    &--vertical,
    &--grow {
      @apply w-full;
    }
  }

  &-wrapper {
    @apply h-full inline-flex max-w-none;

    &--vertical {
      @apply flex-col h-auto;
    }

    &--vertical,
    &--grow {
      @apply min-w-full;
    }
  }
}

.arrow {
  @apply h-full w-10;

  &--vertical {
    @apply min-h-[2.625rem] w-full h-auto;
  }
}
</style>
