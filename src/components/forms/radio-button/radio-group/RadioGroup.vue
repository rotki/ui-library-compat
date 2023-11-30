<script setup lang="ts">
import VRender from '@/components/VRender';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import { type ContextColorsType } from '@/consts/colors';
import type { RadioProps } from '@/components/forms/radio-button/radio/Radio.vue';

export interface Props {
  value?: string;
  inline?: boolean;
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
}

defineOptions({
  name: 'RuiRadioGroup',
});

const props = withDefaults(defineProps<Props>(), {
  value: '',
  inline: false,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  disabled: false,
  color: undefined,
  size: undefined,
});

const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const radioGroupName = ref('');

const slots = useSlots();

const { disabled, color } = toRefs(props);

const children = computed(() =>
  (slots.default?.() ?? []).map((node) => {
    const propsData = (node.componentOptions?.propsData ?? {}) as RadioProps;

    // if group is disabled, disable child buttons
    if (get(disabled)) {
      propsData.disabled = true;
    }

    const rootColor = get(color);
    // if given root color, use it
    if (rootColor) {
      propsData.color = rootColor;
    }

    return { node, props: propsData };
  }),
);

onMounted(() => {
  slots.default?.();
  set(radioGroupName, generateId('radio-group'));
});

const css = useCssModule();
</script>

<template>
  <div>
    <div v-if="label" class="text-rui-text-secondary text-body-1">
      {{ label }}
    </div>
    <div :class="[css.wrapper, { [css.wrapper__inline]: inline }]">
      <VRender
        v-for="(child, i) in children"
        :key="i"
        :v-node="child.node"
        v-bind="child.props"
        :size="size"
        :value="value"
        hide-details
        :name="radioGroupName"
        @input="emit('input', $event)"
      />
    </div>
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
  &__inline {
    @apply flex space-x-6;
  }
}
</style>
