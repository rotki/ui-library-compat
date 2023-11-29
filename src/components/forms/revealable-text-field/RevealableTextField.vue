<script setup lang="ts">
import { default as RuiTextField } from '@/components/forms/text-field/TextField.vue';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
import { type ContextColorsType } from '@/consts/colors';
import { type RuiIcons } from '~/src';

// keep these props in sync with TextField props
export interface Props {
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  color?: ContextColorsType;
  textColor?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  errorMessages?: string[];
  successMessages?: string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
}

defineOptions({
  name: 'RuiRevealableTextField',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  value: '',
  label: '',
  placeholder: '',
  variant: 'default',
  color: undefined,
  textColor: undefined,
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  prependIcon: undefined,
  appendIcon: undefined,
  readonly: false,
});

const hidden: Ref<boolean> = ref(true);

const attrs = useAttrs();
const slots = useSlots();
</script>

<template>
  <RuiTextField
    v-bind="{ ...props, ...attrs }"
    :type="hidden ? 'password' : 'text'"
    v-on="
      // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
      $listeners
    "
  >
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template #append>
      <RuiButton
        :disabled="disabled"
        tabindex="-1"
        variant="text"
        type="button"
        icon
        class="!p-2"
        @click="hidden = !hidden"
      >
        <RuiIcon
          class="text-black/[.54] dark:text-white/[.56]"
          size="20"
          :name="hidden ? 'eye-off-line' : 'eye-line'"
        />
      </RuiButton>

      <slot name="append" />
    </template>
  </RuiTextField>
</template>
