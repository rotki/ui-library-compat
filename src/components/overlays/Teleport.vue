<script setup lang="ts">
import { type Ref, onBeforeUnmount, onMounted, ref } from 'vue';
import { type VueInstance, isClient } from '@vueuse/core';
import { type Slot } from 'vue/types/v3-setup-context';
import TeleportContainer from './teleport-container';

defineOptions({
  name: 'RuiTeleport',
  abstract: true,
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    prepend?: boolean;
    selector?: string;
    tag?: string;
  }>(),
  {
    selector: `#${generateId('rui-teleport-container')}`,
    tag: 'DIV',
    prepend: false,
    disabled: false,
  },
);

const { selector, tag, prepend, disabled } = toRefs(props);
const container: Ref<(VueInstance & { updatedNodes?: Slot }) | null> =
  ref(null);
const slots = useSlots();

const getTargetEl = () => {
  if (!isClient) {
    return;
  }
  return document.querySelector(get(selector));
};

const insertTargetEl = () => {
  if (!isClient) {
    return;
  }
  const parent = document.querySelector('body');
  const child = document.createElement(get(tag));
  child.id = get(selector).substring(1);
  if (get(prepend)) {
    parent?.insertBefore(child, parent.firstChild);
  } else {
    parent?.appendChild(child);
  }
};

const mount = () => {
  if (!isClient) {
    return;
  }
  const targetEl = getTargetEl();

  if (!targetEl) {
    return;
  }

  const el = document.createElement('DIV');

  if (get(prepend) && targetEl.firstChild) {
    targetEl.insertBefore(el, targetEl.firstChild);
  } else {
    targetEl.appendChild(el);
  }

  set(
    container,
    new TeleportContainer({
      el,
      propsData: {
        nodes: slots.default,
        tag: get(tag),
      },
    }),
  );
};

onMounted(() => {
  if (!getTargetEl()) {
    insertTargetEl();
  }
  if (!get(disabled)) {
    mount();
  }
});

onUpdated(() => {
  const containerEl = get(container);
  if (!get(disabled) && containerEl) {
    containerEl.updatedNodes = slots.default;
  }
});

onBeforeUnmount(() => {
  const containerEl = get(container);
  if (containerEl) {
    containerEl.$destroy();
    set(container, null);
  }
});
</script>

<template>
  <div data-rui-teleport class="hidden" />
</template>
