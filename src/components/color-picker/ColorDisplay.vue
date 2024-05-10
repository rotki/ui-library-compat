<script setup lang='ts'>
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';

const props = defineProps<{
  color: string;
}>();

const { color } = toRefs(props);

const { copy, copied } = useClipboard({ source: color });
</script>

<template>
  <Tooltip
    :popper="{ placement: 'top' }"
    :close-delay="400"
    tooltip-class="text-center"
  >
    <template #activator>
      <div
        class="rui-color-display w-8 h-8 min-w-8 min-h-8 rounded-full cursor-pointer"
        :style="{ background: color }"
        @click="copy()"
      />
    </template>
    <div :class="{ 'h-0 overflow-hidden': copied }">
      Click to copy
    </div>
    <div
      v-if="copied"
      class="text-rui-success"
    >
      COPIED!
    </div>
  </Tooltip>
</template>
