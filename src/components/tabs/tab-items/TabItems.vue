<script lang="ts" setup>
import VRender from '@/components/VRender';
import { type TabItemProps } from '@/components/tabs/tab-item/TabItem.vue';

export interface Props {
  value?: number | string;
}

defineOptions({
  name: 'RuiTabItems',
});

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
});

const { value } = toRefs(props);

const slots = useSlots();
const reverse: Ref<boolean> = ref(false);
const currIndex: Ref<number> = ref(-1);
const activeIndex: Ref<number> = ref(-1);

watch(currIndex, (index) => {
  nextTick(() => {
    set(activeIndex, index);
  });
});

const children = computed(() => {
  const tabs = slots.default?.() ?? [];
  let anyActive = false;
  const children = tabs
    .filter((tab) => !!tab.tag)
    .map((tab, index) => {
      const propsData = (tab.componentOptions?.propsData || {}) as TabItemProps;
      const tabValue = propsData.value ?? index;
      const active = get(value) === tabValue;
      if (active) {
        anyActive = true;
        set(reverse, index < get(currIndex));
        set(currIndex, index);
      }

      if (tab.componentOptions?.propsData) {
        tab.componentOptions.propsData = {
          ...propsData,
          value: propsData?.value ?? tabValue,
        };
      }

      return tab;
    });

  if (!anyActive) {
    set(currIndex, -1);
  }

  return children;
});

const wrapper = ref<HTMLDivElement>();
const inner = ref<HTMLDivElement>();

const { height: innerHeight } = useElementSize(inner);
const css = useCssModule();
</script>

<template>
  <div ref="wrapper" :class="css.tabs">
    <div ref="inner">
      <VRender
        v-for="(child, i) in children"
        :key="i"
        :v-node="child"
        :reverse="reverse"
        :active="i === activeIndex"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.tabs {
  @apply grow transition-all;
  height: calc(v-bind(innerHeight) * 1px);
}
</style>
