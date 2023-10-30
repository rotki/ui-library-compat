<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';
import Button from '@/components/buttons/button/Button.vue';

export interface TabProps {
  color?: ContextColorsType;
  disabled?: boolean;
  grow?: boolean;
  tabValue?: number | string;
  active?: boolean;
  link?: boolean;
  target?: string;
  to?: string;
  exact?: boolean;
  exactPath?: boolean;
  vertical?: boolean;
  align?: 'start' | 'center' | 'end';
}

defineOptions({
  name: 'RuiTab',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TabProps>(), {
  color: undefined,
  disabled: false,
  grow: false,
  tabValue: generateId(),
  active: false,
  link: false,
  to: '',
  target: '_self',
  exact: false,
  exactPath: false,
  vertical: false,
  align: 'center',
});

const emit = defineEmits<{
  (e: 'click', tabValue: string | number): void;
}>();

const { target, grow, active, disabled, vertical, align, tabValue } =
  toRefs(props);

const css = useCssModule();

const isSelf = computed(() => get(target) === '_self');

const tabClass = computed(() => [
  css.tab,
  css[`tab--${get(align)}`],
  {
    [css['tab--grow']]: get(grow),
    [`${css['tab--active']} active-tab`]: get(active),
    [css['tab--disabled']]: get(disabled),
    [css['tab--vertical']]: get(vertical),
  },
]);

const slots = useSlots();
const attrs = useAttrs();

const click = () => {
  emit('click', get(tabValue));
};
</script>

<template>
  <Button
    v-if="disabled"
    :class="tabClass"
    disabled
    role="tab"
    v-bind="attrs"
    variant="text"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </Button>
  <Button
    v-else-if="!link"
    :class="tabClass"
    :color="active ? color : undefined"
    role="tab"
    v-bind="attrs"
    variant="text"
    @click="click()"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </Button>
  <RouterLink
    v-else
    #default="{ href, navigate, isActive, isExactActive }"
    :exact="exact"
    :exact-path="exactPath"
    :to="to"
    custom
  >
    <Button
      :class="[
        ...tabClass,
        {
          [`${css['tab--active']} active-tab-link`]: exact
            ? isExactActive
            : isActive,
        },
      ]"
      :color="active || (exact ? isExactActive : isActive) ? color : undefined"
      :href="isSelf ? undefined : href"
      :target="target"
      role="tab"
      tag="a"
      v-bind="attrs"
      variant="text"
      @click="
        click();
        isSelf ? navigate($event) : undefined;
      "
    >
      <template v-for="(_, name) in slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </Button>
  </RouterLink>
</template>

<style lang="scss" module>
.tab {
  @apply h-full min-w-[90px] max-w-[360px] flex items-center rounded-none cursor-pointer relative whitespace-nowrap shrink-0;
  @apply px-4 #{!important};

  &--vertical {
    @apply h-[2.625rem] w-full max-w-none;
  }

  &--grow {
    @apply grow max-w-none;
  }

  &--active {
    &:after {
      content: '';
      @apply absolute h-0 w-full bottom-0 left-0 border-b-2 border-current;
    }

    &.tab--vertical {
      &:after {
        @apply h-full w-0 right-0 left-auto border-b-0 border-r-2;
      }
    }
  }

  &--disabled {
    @apply cursor-not-allowed;
  }

  &--start {
    @apply justify-start text-left rtl:justify-end rtl:text-right;
  }

  &--center {
    @apply justify-center text-center;
  }

  &--end {
    @apply justify-end text-right rtl:justify-start rtl:text-left;
  }
}
</style>
