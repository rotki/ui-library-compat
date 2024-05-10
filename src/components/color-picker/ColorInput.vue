<script lang="ts" setup>
import tinycolor from 'tinycolor2';
import { clamp } from '@vueuse/shared';
import TextField from '@/components/forms/text-field/TextField.vue';
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import type { Color } from './utils';

const props = defineProps<{
  value: Color;
}>();

const emit = defineEmits<{
  (e: 'input', color: Color): void;
}>();

const modelValue = useVModel(props, 'value', emit, {
  eventName: 'input',
});

const inputType = ref<'hex' | 'rgb'>('hex');
const state = reactive({
  color: props.value,
  hex: props.value.hex,
  rgb: props.value.rgb,
});

function onInputTypeChange() {
  set(inputType, get(inputType) === 'rgb' ? 'hex' : 'rgb');
}

const onBlurChange = useDebounceFn((inputType: string, event: any, key?: number) => {
  if (!state.color)
    return;

  const value = event.target.value;
  if (inputType === 'hex') {
    const _hex = value.replace('#', '');
    if (tinycolor(_hex).isValid() && [3, 4, 6].includes(_hex.length))
      state.color.hex = _hex;

    else
      state.color.hex = '000000';
  }
  else if (key !== undefined && state.rgb && state.color) {
    let valueInNumber = Number(value);
    valueInNumber = clamp(valueInNumber, 0, 255);

    state.rgb[key] = valueInNumber;
    const [r, g, b] = state.rgb;
    state.color.hex = tinycolor({ r, g, b }).toHex();
  }
}, 100);

const onInputChange = useDebounceFn((inputType: string, value: string, key?: number) => {
  if (!value)
    return;

  if (inputType === 'hex') {
    const _hex = value.replace('#', '');
    if (tinycolor(_hex).isValid() && state.color && _hex.length === 6)
      state.color.hex = _hex;
  }
  else if (key !== undefined && state.rgb && state.color) {
    let valueInNumber = Number(value);
    valueInNumber = clamp(valueInNumber, 0, 255);

    state.rgb[key] = valueInNumber;
    const [r, g, b] = state.rgb;
    state.color.hex = tinycolor({ r, g, b }).toHex();
  }

  set(modelValue, state.color);
}, 300);

whenever(
  () => props.value,
  (value) => {
    state.color = value;
    state.hex = state.color.hex;
    state.rgb = state.color.rgb;
  },
  { deep: true },
);
</script>

<template>
  <div class="rui-color-input flex justify-center gap-2">
    <div class="flex flex-col items-center gap-1 w-[16rem]">
      <div class="w-full">
        <TextField
          v-if="inputType === 'hex'"
          v-model="state.hex"
          variant="outlined"
          class="flex-1 w-full [&_input]:uppercase"
          maxlength="6"
          color="primary"
          dense
          hide-details
          @input="onInputChange(inputType, $event)"
          @blur="onBlurChange(inputType, $event)"
        >
          <template #prepend>
            <span class="text-rui-text">
              #
            </span>
          </template>
        </TextField>
        <div
          v-else
          class="flex flex-1 gap-1"
        >
          <TextField
            v-for="(v, i) in state.rgb"
            :key="i"
            :value="v.toString()"
            variant="outlined"
            class="[&_input]:text-center w-full"
            maxlength="3"
            color="primary"
            dense
            hide-details
            @input="onInputChange(inputType, $event, i)"
            @blur="onBlurChange(inputType, $event, i)"
          />
        </div>
      </div>

      <div class="uppercase text-rui-text-secondary text-sm">
        {{ inputType }}
      </div>
    </div>
    <Button
      class="h-10"
      variant="text"
      @click="onInputTypeChange()"
    >
      <Icon name="expand-up-down-line" />
    </Button>
  </div>
</template>
