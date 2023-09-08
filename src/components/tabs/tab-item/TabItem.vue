<script lang="ts" setup>
export interface TabItemProps {
  active?: boolean;
  value: number | string;
  eager?: boolean;
  reverse?: boolean;
}

defineOptions({
  name: 'RuiTabItem',
});

withDefaults(defineProps<TabItemProps>(), {
  eager: false,
  active: false,
  reverse: false,
});

const css = useCssModule();
</script>

<template>
  <div :class="[css.tab, { 'active-tab-item': active }]">
    <Transition
      enter-active-class="w-full transform duration-300 transition"
      :enter-class="`opacity-0 ${reverse ? '-translate-x-8' : 'translate-x-8'}`"
      enter-to-class="opacity-100 translate-x-0"
      leave-class="opacity-100 translate-x-0 !h-0 overflow-hidden"
      leave-active-class="w-full transform duration-300 transition !h-0 overflow-hidden"
      :leave-to-class="`opacity-0 !h-0 overflow-hidden ${
        reverse ? 'translate-x-8' : '-translate-x-8'
      }`"
    >
      <div v-if="active" class="w-full">
        <slot />
      </div>
    </Transition>
    <div v-if="eager && !active" class="hidden">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
.tab {
  @apply w-full;
}
</style>
