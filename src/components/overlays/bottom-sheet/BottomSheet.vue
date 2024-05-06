<script setup lang="ts">
import RuiDialog from '@/components/overlays/dialog/Dialog.vue';

// keep these props in sync with Dialog props
export interface Props {
  value?: boolean;
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

defineOptions({
  name: 'RuiBottomSheet',
});

const props = withDefaults(defineProps<Props>(), {
  value: false,
  persistent: false,
});

const attrs = useAttrs();
const slots = useSlots();
</script>

<template>
  <RuiDialog
    bottom-sheet
    v-bind="{ ...props, ...attrs }"
    v-on="
      // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
      $listeners
    "
  >
    <!-- Pass on all named slots -->
    <slot
      v-for="slot in Object.keys(slots)"
      :slot="slot"
      :name="slot"
    />

    <!-- Pass on all scoped slots -->
    <template
      v-for="slot in Object.keys($scopedSlots)"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
      />
    </template>
  </RuiDialog>
</template>
