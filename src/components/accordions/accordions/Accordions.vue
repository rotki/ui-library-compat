<script lang="ts" setup>
import VRender from '@/components/VRender';
import type { AccordionProps } from '@/components/accordions/accordion/Accordion.vue';

export interface Props {
  value?: number[] | number;
  multiple?: boolean;
}

defineOptions({
  name: 'RuiAccordions',
});

const props = withDefaults(defineProps<Props>(), {
  value: -1,
  multiple: false,
});

const emit = defineEmits<{
  (e: 'input', value: number | number[]): void;
}>();

const { value, multiple } = toRefs(props);

const internalValue = ref();

const slots = useSlots();
const children = computed(() => {
  const accordions = slots.default?.() ?? [];
  const currentValue = get(internalValue);
  const multipleVal = get(multiple);

  return accordions.map((accordion, index) => {
    // @ts-expect-error
    // The componentOptions.propsData is messed when combined with props from the parent.
    // So use `initialPropsData`, the original `propsData` that haven't touched by the code below.
    const propsData = (accordion.componentOptions?.initialPropsData
      || accordion.componentOptions?.propsData
      || {}) as AccordionProps;

    const open = multipleVal && Array.isArray(currentValue) ? currentValue.includes(index) : currentValue === index;

    return {
      node: accordion,
      props: {
        ...propsData,
        open,
      },
    };
  });
});

function updateValue(newModelValue: number) {
  let newValue: number[] | number;
  const internal = get(internalValue);
  if (get(multiple) && Array.isArray(internal)) {
    const temp = [...get(internal)];
    const index = temp.indexOf(newModelValue);
    if (index === -1)
      temp.push(newModelValue);
    else
      temp.splice(index, 1);
    newValue = temp;
  }
  else {
    if (internal === newModelValue)
      newValue = -1;
    else
      newValue = newModelValue;
  }
  emit('input', newValue);
  set(internalValue, newValue);
}

watch([value, multiple], ([value, multiple]) => {
  let internal: number | number[] = value;
  if (multiple && !Array.isArray(internal))
    internal = internal === -1 ? [] : [internal];
  else if (!multiple && Array.isArray(internal))
    internal = internal[0] ?? -1;

  set(internalValue, internal);
}, { immediate: true });
</script>

<template>
  <div>
    <VRender
      v-for="(child, i) in children"
      :key="i"
      :v-node="child.node"
      v-bind="child.props"
      @click="updateValue(i)"
    />
  </div>
</template>
