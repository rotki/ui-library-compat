<script lang="ts" setup>
import VRender from '@/components/VRender';
import { type ContextColorsType } from '@/consts/colors';
import type { ButtonProps } from '@/components/buttons/button/Button.vue';

type ModelType = ButtonProps['value'];

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: 'sm' | 'lg';
  required?: boolean;
  value?: ModelType | ModelType[];
  disabled?: boolean;
}

defineOptions({
  name: 'RuiButtonGroup',
});

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  color: undefined,
  variant: 'default',
  size: undefined,
  value: undefined,
});

const emit = defineEmits<{
  (e: 'input', value?: ModelType | ModelType[]): void;
}>();

const slots = useSlots();
const { value, required } = toRefs(props);
const children = computed(() =>
  (slots.default?.() ?? []).map((node, i) => {
    const propsData = (node.componentOptions?.propsData || {}) as ButtonProps;

    propsData.active = activeItem(propsData?.value ?? i);
    return { node, props: propsData };
  }),
);

const activeItem = (id: ModelType) => {
  const selected = get(value);
  if (Array.isArray(selected)) {
    return selected.includes(id);
  }
  return selected === id;
};

const onClick = (id: ModelType) => {
  const selected = get(value);
  const mandatory = get(required);
  if (Array.isArray(selected)) {
    const index = selected.indexOf(id);
    if (index >= 0) {
      if (!mandatory || selected.length !== 1) {
        selected.splice(index, 1);
      }
    } else {
      selected.push(id);
    }
    emit('input', selected);
  } else if (mandatory) {
    emit('input', id);
  } else {
    emit('input', activeItem(id) ? undefined : id);
  }
};

const css = useCssModule();

onMounted(() => {
  slots.default?.();
});
</script>

<template>
  <div>
    <div
      :class="[
        css.wrapper,
        css[color ?? ''],
        css[variant],
        { [css.wrapper__vertical]: vertical },
      ]"
    >
      <VRender
        v-for="(child, i) in children"
        :key="i"
        :class="css.button"
        :color="color"
        :disabled="disabled"
        :size="size"
        :v-node="child.node"
        v-bind="child.props"
        :variant="variant"
        @input="onClick($event ?? i)"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.wrapper {
  @apply inline-flex rounded overflow-hidden divide-x divide-rui-grey-400;
  @apply outline outline-1 outline-transparent outline-offset-[-1px];

  &__vertical {
    @apply inline-flex flex-col items-start divide-x-0 divide-y;

    .button {
      @apply w-full;
    }
  }

  .button {
    @apply rounded-none border-0 outline-0;
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      @apply divide-rui-#{$color}-darker;

      &.outlined,
      &.text {
        @apply divide-rui-#{$color}/[0.5];
      }

      &.outlined {
        @apply outline-rui-#{$color}/[0.5];
      }
    }
  }

  &.outlined {
    @apply outline-rui-text divide-rui-text;
  }
}
</style>
