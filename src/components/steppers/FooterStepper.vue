<script lang="ts" setup>
import RuiIcon from '@/components/icons/Icon.vue';
import RuiButton from '@/components/buttons/button/Button.vue';
import RuiProgress from '@/components/progress/Progress.vue';

export interface Props {
  pages: number;
  value?: number;
  variant?: 'numeric' | 'bullet' | 'progress' | 'pill';
  arrowButtons?: boolean;
  hideButtons?: boolean;
}

defineOptions({
  name: 'RuiFooterStepper',
});

const props = withDefaults(defineProps<Props>(), {
  value: 1,
  variant: 'numeric',
  arrowButtons: false,
  hideButtons: false,
});

const emit = defineEmits<{
  (event: 'input', modelValue: number): void;
}>();

const css = useCssModule();

const { value, pages } = toRefs(props);

function onChange(delta: number) {
  emit('input', get(value) + delta);
}

function onPrev() {
  const newValue = get(value);
  if (newValue)
    onChange(-1);
}

function onNext() {
  const newValue = get(value);
  if (newValue < get(pages))
    onChange(1);
}

function onClick(index: number) {
  onChange(index - get(value));
}
</script>

<template>
  <div :class="[css['footer-stepper'], css[variant ?? '']]">
    <template v-if="variant === 'pill'">
      <div :class="css.pills">
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.pill, { [css.active]: value === i }]"
        />
      </div>
    </template>
    <template v-else>
      <RuiButton
        v-if="!hideButtons"
        :class="{ [css.arrow__button]: arrowButtons }"
        :disabled="value <= 1"
        :icon="arrowButtons"
        :variant="arrowButtons ? 'outlined' : 'text'"
        color="primary"
        @click="onPrev()"
      >
        <template
          v-if="!arrowButtons"
          #prepend
        >
          <RuiIcon
            :size="18"
            name="arrow-left-s-line"
          />
        </template>
        <span v-if="!arrowButtons">Back</span>
        <RuiIcon
          v-else
          :size="24"
          name="arrow-left-line"
        />
      </RuiButton>
      <span
        v-if="variant === 'numeric'"
        :class="css.numeric"
      >
        {{ value }}/{{ pages }}
      </span>
      <div
        v-else-if="variant === 'bullet'"
        :class="css.bullets"
      >
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.bullet, { [css.active]: value === i }]"
          @click="onClick(i)"
        />
      </div>
      <RuiProgress
        v-else-if="variant === 'progress'"
        :class="css.progress"
        color="primary"
        :value="(value / pages) * 100"
      />
      <RuiButton
        v-if="!hideButtons"
        :class="{ [css.arrow__button]: arrowButtons }"
        :disabled="value >= pages"
        :icon="arrowButtons"
        :variant="arrowButtons ? 'outlined' : 'text'"
        color="primary"
        @click="onNext()"
      >
        <span v-if="!arrowButtons">Next</span>
        <RuiIcon
          v-else
          :size="24"
          name="arrow-right-line"
        />
        <template
          v-if="!arrowButtons"
          #append
        >
          <RuiIcon
            :size="18"
            name="arrow-right-s-line"
          />
        </template>
      </RuiButton>
    </template>
  </div>
</template>

<style lang="scss" module>
.footer-stepper {
  @apply flex items-center justify-between gap-x-4 transition-all duration-150;

  .numeric {
    @apply text-rui-text;
  }

  .bullets,
  .pills {
    @apply flex;

    .bullet,
    .pill {
      @apply rounded-full h-2 bg-black/[0.26] transition-colors;

      &.active {
        @apply bg-rui-primary;
      }
    }

    .bullet {
      @apply hover:bg-rui-grey-300 cursor-pointer;

      &.active {
        @apply hover:bg-rui-primary;
      }
    }

    .pill {
      @apply bg-rui-grey-200;
    }
  }

  .bullets {
    @apply gap-x-1;

    .bullet {
      @apply w-2;
    }
  }

  .pills {
    @apply w-full gap-x-3;

    .pill {
      @apply w-full;
    }
  }

  .progress {
    @apply max-w-[60%];
  }

  .arrow__button {
    @apply bg-white disabled:bg-white/60 #{!important};
  }
}

:global(.dark) {
  .footer-stepper {
    .bullets,
    .pills {
      .bullet,
      .pill {
        @apply bg-rui-grey-300;

        &.active {
          @apply bg-rui-primary;
        }
      }

      .bullet {
        @apply hover:bg-rui-grey-400;

        &.active {
          @apply hover:bg-rui-primary;
        }
      }
    }

    .bullets {
      .bullet {
        @apply bg-white/30;
      }
    }

    .arrow__button {
      @apply disabled:bg-[rgb(50,50,50)] #{!important};
    }
  }
}
</style>
