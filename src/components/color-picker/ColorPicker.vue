<script lang="ts" setup>
// Inspired by https://github.com/aesoper101/vue3-colorpicker/
import ColorBoard from '@/components/color-picker/ColorBoard.vue';
import ColorHue from '@/components/color-picker/ColorHue.vue';
import ColorInput from '@/components/color-picker/ColorInput.vue';
import ColorDisplay from '@/components/color-picker/ColorDisplay.vue';
import { getRootAttrs } from '@/utils/helpers';
import { Color } from './utils';

export interface Props {
  value?: string;
}

defineOptions({
  name: 'RuiColorPicker',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), { value: '' });

const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const { value } = toRefs(props);

const state = reactive({
  color: new Color(get(value)),
});

function onHueChange(hue: number) {
  state.color.hue = hue;
}

function onBoardChange({ saturation, brightness }: { saturation: number; brightness: number }) {
  state.color.saturation = saturation;
  state.color.brightness = brightness;
}

whenever(
  value,
  (value: string) => {
    if (state.color.hex !== value)
      state.color = new Color(value);
  },
  { deep: true },
);

watch(state, (state) => {
  emit('input', state.color.hex);
}, { immediate: true, deep: true });

const attrs = useAttrs();
</script>

<template>
  <div
    class="rui-color-picker relative select-none bg-initial"
    v-bind="getRootAttrs(attrs)"
  >
    <ColorBoard
      :color="state.color"
      @input="onBoardChange($event)"
    />
    <div class="flex flex-col gap-5 p-4">
      <div class="flex items-center gap-4">
        <ColorDisplay :color="state.color.toHexString()" />
        <ColorHue
          class="flex-1"
          :color="state.color"
          @input="onHueChange($event)"
        />
      </div>

      <ColorInput v-model="state.color" />
    </div>
  </div>
</template>
