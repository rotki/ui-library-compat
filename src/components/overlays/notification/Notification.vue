<script lang='ts' setup>
import RuiTeleport from '@/components/overlays/Teleport';

export interface NotificationProps {
  value: boolean;
  timeout: number;
  width?: number | string;
  theme?: 'light' | 'dark';
}

defineOptions({
  name: 'RuiNotification',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<NotificationProps>(),
  {
    width: 400,
    theme: undefined,
  },
);

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
}>();

const { timeout, value, width } = toRefs(props);

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
}));

function dismiss() {
  if (get(timeout) < 0)
    return;

  emit('input', false);
}

watchImmediate(value, (display) => {
  if (!display)
    return;

  const duration = get(timeout);
  if (duration > 0) {
    setTimeout(() => {
      emit('input', false);
    }, duration);
  }
});
</script>

<template>
  <RuiTeleport immediate>
    <Transition
      v-if="value"
      enter-class="opacity-0"
      enter-active-class="ease-out duration-150"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-active-class="ease-in duration-100"
      leave-to-class="opacity-0"
    >
      <div
        class="top-2 right-2 fixed drop-shadow-lg z-50"
        :class="{
          'bg-white dark:bg-[#363636]': !theme,
          'bg-white text-rui-light-text': theme === 'light',
          'bg-[#363636] text-rui-dark-text': theme === 'dark',
        }"
        :style="style"
        v-bind="$attrs"
        @click="dismiss()"
      >
        <slot />
      </div>
    </Transition>
  </RuiTeleport>
</template>
