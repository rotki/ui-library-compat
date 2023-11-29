<script lang="ts" setup>
import { objectOmit } from '@vueuse/shared';
import { type ContextColorsType } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';

export interface Props {
  value?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiCheckbox',
});

const props = withDefaults(defineProps<Props>(), {
  value: false,
  indeterminate: false,
  disabled: false,
  color: undefined,
  size: undefined,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
});

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'update:indeterminate', indeterminate: boolean): void;
}>();

const { size, value, errorMessages, successMessages } = toRefs(props);

const input = (target: EventTarget | null) => {
  if (!target) {
    return;
  }
  const { checked } = target as HTMLInputElement;
  if (checked) {
    emit('update:indeterminate', false);
  }
  emit('input', checked);
};

const iconSize: ComputedRef<number> = computed(() => {
  const sizeVal = get(size);
  if (sizeVal === 'lg') {
    return 28;
  }
  if (sizeVal === 'sm') {
    return 20;
  }
  return 24;
});

const css = useCssModule();
const attrs = useAttrs();

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);
</script>

<template>
  <div>
    <label
      :class="[
        css.wrapper,
        css[size ?? ''],
        {
          [css.disabled]: disabled,
        },
      ]"
    >
      <input
        :checked="value"
        :class="css.input"
        :disabled="disabled"
        type="checkbox"
        v-bind="objectOmit(attrs, ['class'])"
        @input="input($event.target)"
      />
      <span
        :class="[
          css.checkbox,
          css[color ?? ''],
          css[size ?? ''],
          {
            [css.checked]: value || indeterminate,
            [css.disabled]: disabled,
            [css['with-error']]: hasError,
            [css['with-success']]: hasSuccess && !hasError,
          },
        ]"
      >
        <Icon
          v-if="indeterminate"
          :size="iconSize"
          name="checkbox-indeterminate-fill"
        />
        <Icon v-else-if="value" :size="iconSize" name="checkbox-fill" />
        <Icon v-else :size="iconSize" name="checkbox-blank-line" />
      </span>
      <span :class="css.label" class="text-body-1">
        <slot>{{ label }}</slot>
      </span>
    </label>
    <FormTextDetail
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative flex items-start cursor-pointer -ml-[9px];

  &.disabled {
    @apply cursor-not-allowed;

    .checkbox {
      @apply opacity-50;

      &:before {
        content: none !important;
      }
    }

    .label {
      @apply text-rui-text-disabled;
    }
  }

  .input {
    @apply appearance-none w-[1px] h-[1px] absolute z-[2] outline-none select-none;

    &:focus {
      + .checkbox {
        &:before {
          @apply opacity-5;
        }
      }
    }
  }

  .checkbox {
    @apply relative text-rui-text-secondary p-[9px];

    &:before {
      content: '';
      @apply absolute top-1/2 left-1/2 block h-[42px] w-[42px] -translate-y-1/2 -translate-x-1/2 rounded-full opacity-0 transition-opacity;
      @apply bg-black;
    }

    &.with-error {
      @apply text-rui-error #{!important};
    }

    &.with-success {
      @apply text-rui-success #{!important};
    }

    &:hover {
      &:before {
        @apply opacity-5;
      }
    }

    &:active {
      &:before {
        @apply opacity-30;
      }
    }

    &.lg {
      &:before {
        @apply h-[46px] w-[46px];
      }
    }

    &.sm {
      &:before {
        @apply h-[38px] w-[38px];
      }
    }

    $colors: 'primary', 'secondary', 'error', 'warning', 'info', 'success';

    @each $color in $colors {
      &.#{$color} {
        @apply before:bg-rui-#{$color};
        &.checked {
          @apply text-rui-#{$color};
        }
      }
    }
  }

  .label {
    @apply flex-1 text-rui-text;

    &:not(:empty) {
      @apply mt-[9px];
    }
  }

  &.sm {
    .label {
      &:not(:empty) {
        @apply mt-[7px];
      }
    }
  }

  &.lg {
    .label {
      &:not(:empty) {
        @apply mt-[11px];
      }
    }
  }
}
</style>
