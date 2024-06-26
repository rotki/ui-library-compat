<script setup lang="ts">
import { objectOmit } from '@vueuse/shared';
import RuiTeleport from '@/components/overlays/Teleport';

export interface DialogProps {
  value?: boolean;
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  bottomSheet?: boolean;
  contentClass?: any;
}

defineOptions({
  name: 'RuiDialog',
});

const props = withDefaults(defineProps<DialogProps>(), {
  value: false,
  persistent: false,
  width: '98%',
  bottomSheet: false,
  contentClass: '',
});

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'closed'): void;
}>();

const css = useCssModule();

const {
  value,
  width,
  maxWidth,
  bottomSheet,
} = toRefs(props);

const internalValue: Ref<boolean> = ref(false);
const isOpen: Ref<boolean> = ref(false);

watchImmediate(value, (value) => {
  nextTick(() => {
    set(internalValue, value);
  });
});

watch(internalValue, (value) => {
  if (value) {
    nextTick(() => {
      set(isOpen, value);
    });
  }
  else {
    setTimeout(() => {
      set(isOpen, value);
    }, 100);
  }
});

function input(value: boolean) {
  emit('input', value);

  if (!value)
    emit('closed');
}

watch(isOpen, (isOpen) => {
  if (isOpen) {
    input(isOpen);
    set(internalValue, isOpen);
  }
  else {
    setTimeout(() => {
      input(isOpen);
      set(internalValue, isOpen);
    }, 100);
  }
});

function close() {
  set(isOpen, false);
}

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
  maxWidth: transformPropsUnit(get(maxWidth)),
}));

const contentRef: Ref<HTMLDivElement | undefined> = ref(undefined);

watch(contentRef, (contentRef) => {
  if (contentRef) {
    nextTick(() => {
      contentRef.focus();
    });
  }
});

const on = computed(() => ({
  click: () => {
    const newValue = !get(internalValue);
    set(internalValue, newValue);
    input(newValue);
  },
}));

const contentTransition = computed(() => {
  if (!get(bottomSheet)) {
    return {
      enterClass: 'opacity-0 scale-75',
      enterActiveClass: 'ease-out duration-150',
      enterToClass: 'opacity-100 scale-100',
      leaveClass: 'opacity-100 scale-100',
      leaveActiveClass: 'ease-in duration-100',
      leaveToClass: 'opacity-0 scale-75',
    };
  }

  return {
    enterClass: 'translate-y-full',
    enterActiveClass: 'ease-out duration-150',
    enterToClass: 'translate-y-0',
    leaveClass: 'translate-y-0',
    leaveActiveClass: 'ease-in duration-100',
    leaveToClass: 'translate-y-full',
  };
});
</script>

<template>
  <div>
    <slot
      name="activator"
      v-bind="{ on, isOpen }"
    />
    <RuiTeleport>
      <div
        v-if="isOpen || internalValue"
        :class="css.wrapper"
        role="dialog"
        tabindex="0"
        @keydown.esc.stop="!persistent && close()"
        v-on="
          // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
          objectOmit($listeners, ['input'])
        "
      >
        <Transition
          enter-class="opacity-0"
          enter-active-class="ease-out duration-150"
          enter-to-class="opacity-100"
          leave-class="opacity-100"
          leave-active-class="ease-in duration-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isOpen && internalValue"
            :class="css.overlay"
            @click.stop="!persistent && close()"
          />
        </Transition>
        <Transition v-bind="contentTransition">
          <div
            v-if="isOpen && internalValue"
            ref="contentRef"
            :style="style"
            tabindex="0"
            :class="[css.content, contentClass, { [css.center]: !bottomSheet }]"
          >
            <slot v-bind="{ isOpen, close }" />
          </div>
        </Transition>
      </div>
    </RuiTeleport>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply fixed z-[9999] w-full h-full top-0 left-0;
}

.overlay {
  @apply absolute top-0 left-0 w-full h-full bg-black/[0.5];
}

.content {
  @apply absolute left-1/2 bottom-0 transform -translate-x-1/2 outline-none overflow-y-auto max-h-[90vh];

  &.center {
    @apply top-1/2 -translate-y-1/2 bottom-auto;
  }
}
</style>
