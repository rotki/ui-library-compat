<script lang="ts" setup>
import { clamp } from '@vueuse/shared';
import { type Color, roundTwoDecimal, useElementDrag } from './utils';

const props = defineProps<{
  color: Color;
}>();

const emit = defineEmits<{
  (e: 'input', hue: number): void;
}>();

const { color } = toRefs(props);

const barElement: Ref<HTMLElement | null> = ref(null);

const hue = computed({
  get() {
    return get(color).hue;
  },
  set(hue: number) {
    emit('input', hue);
  },
});

const cursorWidth = 16;

function getLimit(width: number) {
  const lowerLimit = cursorWidth / 2;
  const upperLimit = width - lowerLimit;
  const availableWidth = upperLimit - lowerLimit;

  return { lowerLimit, upperLimit, availableWidth };
}

const cursorLeft: Ref<string> = ref('');

function updatePosition() {
  set(cursorLeft, getCursorLeft().toString());
}

const cursorStyle = computed(() => ({
  left: get(cursorLeft),
}));

const instance = getCurrentInstance();

function getCursorLeft() {
  if (!instance)
    return 0;

  const el = instance.proxy.$el;
  const rect = el?.getBoundingClientRect();

  if (!rect)
    return 0;

  const actualWidth = rect.width;
  const { lowerLimit, availableWidth } = getLimit(actualWidth);

  const hueVal = get(hue);
  const usedHue = hueVal === 360 ? 360 : hueVal % 360;

  const percentage = roundTwoDecimal((usedHue / 360) * (availableWidth / actualWidth) * 100);
  return `calc(${percentage}% + ${lowerLimit}px)`;
}

function emitHue(x: number) {
  if (!instance)
    return;

  const el = instance.proxy.$el;
  const rect = el?.getBoundingClientRect();

  if (!rect)
    return;

  let calculatedX = x - rect.left;

  const { lowerLimit, upperLimit, availableWidth } = getLimit(rect.width);
  calculatedX = clamp(calculatedX, lowerLimit, upperLimit);

  set(hue, Math.round(((calculatedX - lowerLimit) / availableWidth) * 360));
}

const {
  handleClick,
  onMouseDown,
} = useElementDrag(emitHue);

const css = useCssModule();

onMounted(() => {
  updatePosition();
});

watchDeep(color, () => {
  updatePosition();
});
</script>

<template>
  <div
    ref="barElement"
    :class="css.bar"
    class="rui-color-hue"
    @click="handleClick($event)"
    @mousedown="onMouseDown($event)"
  >
    <div
      :class="css.cursor"
      :style="cursorStyle"
    />
  </div>
</template>

<style lang="scss" module>
.bar {
  @apply relative w-full h-3.5 rounded-full cursor-pointer;

  background: linear-gradient(
    to right,
    rgb(255, 0, 0) 0%,
    rgb(255, 255, 0) 16.66%,
    rgb(0, 255, 0) 33.33%,
    rgb(0, 255, 255) 50%,
    rgb(0, 0, 255) 66.66%,
    rgb(255, 0, 255) 83.33%,
    rgb(255, 0, 0) 100%
  );
}

.cursor {
  @apply absolute w-4 h-4 transform top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2 bg-white rounded-full;
}
</style>
