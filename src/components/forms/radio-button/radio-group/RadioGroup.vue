<script setup lang="ts">
import VRender from '@/components/VRender';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';

export interface Props {
  value?: string;
  inline?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiRadioGroup',
});

withDefaults(defineProps<Props>(), {
  value: '',
  inline: false,
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
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
