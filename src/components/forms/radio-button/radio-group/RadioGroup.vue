<script setup lang="ts">
import VRender from '@/components/VRender';

export interface Props {
  value?: string;
  inline?: boolean;
  hint?: string;
  errorMessages?: string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiRadioGroup',
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), {
  value: '',
  inline: false,
  hint: '',
  errorMessages: () => [],
  hideDetails: false,
});

const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const radioGroupName = ref('');

const slots = useSlots();
const children = computed(() => slots.default?.() ?? []);

onMounted(() => {
  slots.default?.();
  set(radioGroupName, generateId('radio-group'));
});

const css = useCssModule();
</script>

<template>
  <div>
    <div :class="[css.wrapper, { [css.wrapper__inline]: inline }]">
      <VRender
        v-for="(child, i) in children"
        :key="i"
        :v-node="child"
        :value="value"
        hide-details
        :name="radioGroupName"
        @input="emit('input', $event)"
      />
    </div>
    <div v-if="!hideDetails" class="details">
      <div v-if="errorMessages.length > 0" class="text-rui-error text-caption">
        {{ errorMessages[0] }}
      </div>
      <div v-else-if="hint" class="text-rui-text-secondary text-caption">
        {{ hint }}
      </div>
      <div v-else class="h-5" />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  &__inline {
    @apply flex space-x-6;
  }
}
</style>
