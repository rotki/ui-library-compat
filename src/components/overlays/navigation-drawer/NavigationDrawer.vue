<script setup lang='ts'>
import { type Ref, ref } from 'vue';
import RuiTeleport from '@/components/overlays/Teleport';
import { getRootAttrs } from '@/utils/helpers';
import type { MaybeElement } from '@vueuse/core';

export interface Props {
  value?: boolean;
  temporary?: boolean;
  stateless?: boolean;
  width?: string | number;
  miniVariant?: boolean;
  overlay?: boolean;
  position?: 'left' | 'right';
  contentClass?: string | object | string[];
}

defineOptions({
  name: 'RuiNavigationDrawer',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  value: false,
  temporary: false,
  stateless: false,
  width: 360,
  miniVariant: false,
  overlay: false,
  position: 'left',
  contentClass: '',
});

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'closed'): void;
}>();

const attrs = useAttrs();
const css = useCssModule();

const {
  value,
  position,
  miniVariant,
  width,
} = toRefs(props);

function input(value: boolean) {
  emit('input', value);

  if (!value)
    emit('closed');
}

const internalValue: Ref<boolean> = ref(false);

watchImmediate(value, (value) => {
  set(internalValue, value);
});

watch(internalValue, (value) => {
  input(value);
});

function close() {
  set(internalValue, false);
}

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
}));

const content: Ref<MaybeElement | null> = ref(null);

onClickOutside(content, () => {
  if (get(internalValue) && props.temporary && !props.stateless) {
    setTimeout(() => {
      close();
    }, 50);
  }
});

const on = computed(() => ({
  click: () => {
    const newValue = !get(internalValue);
    set(internalValue, newValue);
    input(newValue);
  },
}));
</script>

<template>
  <div>
    <slot
      name="activator"
      v-bind="{ on, open: internalValue }"
    />
    <RuiTeleport immediate>
      <Transition
        v-if="overlay"
        enter-class="opacity-0"
        enter-active-class="ease-out duration-150"
        enter-to-class="opacity-100"
        leave-class="opacity-100"
        leave-active-class="ease-in duration-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="internalValue"
          :class="css.overlay"
          @click.stop="close()"
        />
      </Transition>
      <aside
        ref="content"
        :style="style"
        :class="[
          css.content,
          contentClass,
          {
            [css.visible]: internalValue,
            [css[position]]: position,
            [css.mini]: miniVariant,
            [css.temporary]: temporary,
            [css['with-overlay']]: overlay,
          },
        ]"
        v-bind="getRootAttrs(attrs)"
      >
        <slot v-bind="{ on, close }" />
      </aside>
    </RuiTeleport>
  </div>
</template>

<style lang="scss" module>
.overlay {
  @apply absolute top-0 left-0 w-full h-full bg-black/[0.5] z-[10000];
}

.content {
  @apply transition-all top-0 h-full fixed text-rui-text bg-white z-[7];

  &.left {
    @apply -translate-x-full left-0;
  }

  &.right {
    @apply translate-x-full right-0;
  }

  &.with-overlay {
    @apply z-[10000];
  }

  &.visible {
    @apply translate-x-0;
  }

  &.temporary {
    &.visible {
      @apply shadow-5;
    }
  }

  &.mini {
    @apply translate-x-0;

    &:not(.visible) {
      @apply w-14 #{!important};
    }
  }
}

:global(.dark) {
  .content {
    @apply bg-[#363636];
  }
}
</style>
