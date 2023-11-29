<script lang="ts" setup>
import { objectOmit } from '@vueuse/shared';
import { logicAnd, logicNot } from '@vueuse/math';
import { type ContextColorsType } from '@/consts/colors';
import Icon, { default as RuiIcon } from '@/components/icons/Icon.vue';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import { type RuiIcons } from '~/src';

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
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
}

defineOptions({
  name: 'RuiTextField',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  value: '',
  label: '',
  placeholder: '',
  disabled: false,
  variant: 'default',
  color: undefined,
  textColor: undefined,
  dense: false,
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  prependIcon: undefined,
  appendIcon: undefined,
  readonly: false,
  clearable: false,
});

const emit = defineEmits<{
  (e: 'input', modelValue: string): void;
  (e: 'click:clear'): void;
}>();

const {
  label,
  value,
  clearable,
  disabled,
  readonly,
  errorMessages,
  successMessages,
} = toRefs(props);

const labelWithQuote = computed(() => {
  const labelVal = get(label);
  if (!labelVal) {
    return '"\\200B"';
  }
  return `'  ${get(label)}  '`;
});

const wrapper = ref<HTMLDivElement>();
const innerWrapper = ref<HTMLDivElement>();

const internalValue = computed({
  get: () => get(value),
  set: (val: string) => emit('input', val),
});

const { left: wrapperLeft, right: wrapperRight } = useElementBounding(wrapper);
const { left: innerWrapperLeft, right: innerWrapperRight } =
  useElementBounding(innerWrapper);

const prependWidth = computed(
  () => `${get(innerWrapperLeft) - get(wrapperLeft)}px`,
);
const appendWidth = computed(
  () => `${get(wrapperRight) - get(innerWrapperRight)}px`,
);

const { hasError, hasSuccess, hasMessages } = useFormTextDetail(
  errorMessages,
  successMessages,
);

const css = useCssModule();
const attrs = useAttrs();
const slots = useSlots();

const clearIconClicked = () => {
  set(internalValue, '');
  emit('click:clear');
};

const input = ref();
const { focused } = useFocus(input);

const showClearIcon = logicAnd(
  clearable,
  internalValue,
  logicNot(disabled),
  logicNot(readonly),
);
</script>

<template>
  <div>
    <div
      ref="wrapper"
      :class="[
        css.wrapper,
        css[color],
        css[variant],
        {
          [css.dense]: dense,
          [css.disabled]: disabled,
          [css['no-label']]: !label,
          [css['with-error']]: hasError,
          [css['with-success']]: hasSuccess && !hasError,
          [css[`text_${textColor}`]]: textColor && !hasMessages,
        },
      ]"
    >
      <div class="flex items-center gap-1 shrink-0" :class="css.prepend">
        <div v-if="slots.prepend">
          <slot name="prepend" />
        </div>
        <div v-else-if="prependIcon" :class="[css.icon]">
          <Icon :name="prependIcon" />
        </div>
      </div>
      <div ref="innerWrapper" class="flex flex-1 overflow-hidden">
        <input
          ref="input"
          v-model="internalValue"
          :placeholder="placeholder || ' '"
          :class="css.input"
          :disabled="disabled"
          :readonly="readonly"
          v-bind="objectOmit(attrs, ['class'])"
          v-on="
            // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
            objectOmit($listeners, ['input'])
          "
        />
        <label :class="css.label">
          {{ label }}
        </label>
        <fieldset v-if="variant === 'outlined'" :class="css.fieldset">
          <legend />
        </fieldset>
      </div>
      <div class="flex items-center gap-1 shrink-0" :class="css.append">
        <RuiButton
          v-if="showClearIcon"
          :class="{ hidden: !focused }"
          variant="text"
          type="button"
          icon
          class="!p-2"
          :color="color"
          @click.stop="clearIconClicked()"
        >
          <RuiIcon name="close-line" size="20" />
        </RuiButton>
        <div v-if="slots.append">
          <slot name="append" />
        </div>
        <div v-else-if="appendIcon" :class="[css.icon]">
          <Icon :name="appendIcon" />
        </div>
      </div>
    </div>
    <FormTextDetail
      v-if="!hideDetails"
      class="pt-1 px-3"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

:global(.dark) {
  .wrapper {
    .label {
      @apply border-white/[0.42];

      &:after {
        @apply border-white;
      }
    }

    .icon {
      @apply text-white/[0.56];
    }

    &.filled {
      .input {
        &:focus {
          + .label {
            @apply bg-white/[0.13];
          }
        }
      }

      .label {
        @apply bg-white/[0.09];
      }
    }

    &.outlined {
      .fieldset {
        @apply border-white/[0.23];
      }

      .input {
        &:focus {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }
}

.wrapper {
  @apply relative w-full min-w-[200px] flex items-center pt-3;

  .input {
    @apply leading-6 text-rui-text w-full bg-transparent py-1.5 pr-3 outline-0 outline-none transition-all placeholder:opacity-0 focus:placeholder:opacity-100;

    &:focus {
      @apply outline-0;
      + .label {
        @apply after:scale-x-100;
      }
    }

    &:not(:placeholder-shown),
    &:autofill,
    &:-webkit-autofill,
    &[data-has-value='true'],
    &:focus {
      + .label {
        @apply text-xs leading-tight;
        padding-left: var(--x-padding);
        padding-right: var(--x-padding);
      }
    }

    &:disabled {
      @apply border-dotted;

      &,
      + .label {
        @apply text-rui-text-disabled;
      }

      ~ .fieldset {
        @apply border-dotted;
      }
    }
  }

  .label {
    @apply left-0 text-base leading-[3.75] text-rui-text-secondary pointer-events-none absolute top-0 flex h-full w-full select-none transition-all border-b border-black/[0.42];

    --x-padding: 0px;
    --prepend-width: v-bind(prependWidth);
    --append-width: v-bind(appendWidth);

    padding-left: calc(var(--x-padding) + var(--prepend-width, 0px));
    padding-right: calc(var(--x-padding) + var(--append-width, 0px));

    &:after {
      content: '';
      @apply absolute bottom-0 left-0 block w-full scale-x-0 border-b-2 mb-[-1px] transition-transform duration-300 border-black;
    }
  }

  .icon {
    @apply text-black/[0.54];
  }

  .prepend {
    &:not(:empty) {
      @apply mr-2;
    }
  }

  .append {
    &:not(:empty) {
      @apply ml-2;
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      .input {
        &:focus {
          + .label {
            @apply text-rui-#{$color};
          }
        }
      }

      .label {
        @apply after:border-rui-#{$color};
      }

      &.outlined {
        .input {
          &:focus {
            ~ .fieldset {
              @apply border-rui-#{$color};
            }
          }
        }
      }
    }

    &.text_#{$color},
    &.with-#{$color} {
      .prepend,
      .append,
      .input {
        @apply text-rui-#{$color};
      }

      &:not(.disabled) .prepend svg,
      &:not(.disabled) .append svg {
        @apply text-rui-#{$color};
      }
    }
  }

  @each $color in 'error', 'success' {
    &.with-#{$color} {
      .input {
        @apply border-rui-#{$color} #{!important};
      }

      .label {
        @apply text-rui-#{$color} after:border-rui-#{$color} #{!important};
      }

      .fieldset {
        @apply border-rui-#{$color} #{!important};
      }
    }
  }

  &.dense {
    .input {
      @apply py-1;
    }

    .label {
      @apply leading-[3.5];
    }
  }

  &.filled,
  &.outlined {
    @apply pt-0;

    .prepend {
      &:not(:empty) {
        @apply ml-3 mr-0;
      }
    }

    .append {
      &:not(:empty) {
        @apply mr-3 ml-0;
      }
    }

    .input {
      @apply px-3;
    }

    .label {
      @apply leading-[3.5];
      --x-padding: 0.75rem;
    }
  }

  &.filled {
    .input {
      @apply pt-6 pb-2;

      &:focus {
        + .label {
          @apply bg-black/[0.09];
        }
      }

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        + .label {
          @apply leading-[2.5];

          padding-left: calc(var(--x-padding) + var(--prepend-width, 0px));
          padding-right: calc(var(--x-padding) + var(--append-width, 0px));
        }
      }
    }

    .label {
      @apply rounded-t bg-black/[0.06];
    }

    &.dense {
      .input {
        @apply pt-5 pb-1;
      }

      .label {
        @apply leading-[3];
      }

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        + .label {
          @apply leading-[2.25];
        }
      }
    }

    &.no-label {
      .input {
        @apply py-4;
      }

      &.dense {
        .input {
          @apply py-3;
        }
      }
    }
  }

  &.outlined {
    .input {
      @apply py-4 border-b-0;

      &:focus {
        ~ .fieldset {
          @apply border-2 border-black;
        }
      }

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        @apply border-t-transparent;

        + .label {
          @apply leading-[0] pl-4;
        }

        ~ .fieldset {
          legend {
            &:after {
              content: v-bind(labelWithQuote);
            }
          }
        }
      }
    }

    .fieldset {
      @apply absolute w-full h-[calc(100%+0.5rem)] top-0 left-0 pointer-events-none rounded border border-black/[0.23] px-2 transition-all -mt-2;

      legend {
        @apply opacity-0 text-xs;

        &:after {
          @apply whitespace-break-spaces;
          content: '\200B';
        }
      }
    }

    .label {
      @apply border-0 border-transparent;

      &:after {
        content: none !important;
      }
    }

    &.dense {
      .input {
        @apply py-2;
      }

      .label {
        @apply leading-[2.5];
      }
    }
  }
}
</style>
