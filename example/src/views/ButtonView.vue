<script lang="ts" setup>
import {
  type ButtonGroupProps,
  type ButtonProps,
  RuiButton,
  RuiButtonGroup,
  RuiIcon,
} from '@rotki/ui-library-compat';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

interface ExtraProperties {
  clicks: number;
  prepend?: string;
  append?: string;
  iconName?: string;
}

type ButtonData = ButtonProps & ExtraProperties;

const buttons = ref<ButtonData[]>([
  { clicks: 0, color: 'primary' },
  { clicks: 0, color: 'secondary' },
  { clicks: 0, color: 'error' },
  { clicks: 0, color: 'warning' },
  { clicks: 0, color: 'info' },
  { clicks: 0, color: 'success' },

  { clicks: 0, color: 'primary', variant: 'outlined' },
  { clicks: 0, color: 'secondary', variant: 'outlined' },
  { clicks: 0, color: 'error', variant: 'outlined' },
  { clicks: 0, color: 'warning', variant: 'outlined' },
  { clicks: 0, color: 'info', variant: 'outlined' },
  { clicks: 0, color: 'success', variant: 'outlined' },

  { clicks: 0, color: 'primary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'error', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'warning', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'info', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'success', prepend: 'arrow-right-line' },

  { clicks: 0, color: 'primary', append: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', append: 'arrow-right-line' },
  { clicks: 0, color: 'error', append: 'arrow-right-line' },
  { clicks: 0, color: 'warning', append: 'arrow-right-line' },
  { clicks: 0, color: 'info', append: 'arrow-right-line' },
  { clicks: 0, color: 'success', append: 'arrow-right-line' },

  { clicks: 0, color: 'primary', variant: 'text' },
  { clicks: 0, color: 'secondary', variant: 'text' },
  { clicks: 0, color: 'error', variant: 'text' },
  { clicks: 0, color: 'warning', variant: 'text' },
  { clicks: 0, color: 'info', variant: 'text' },
  { clicks: 0, color: 'success', variant: 'text' },

  { clicks: 0, color: 'primary', disabled: true },
  { clicks: 0, color: 'secondary', disabled: true },
  { clicks: 0, color: 'error', disabled: true },
  { clicks: 0, color: 'warning', disabled: true },
  { clicks: 0, color: 'info', disabled: true },
  { clicks: 0, color: 'success', disabled: true },

  { clicks: 0, color: 'primary', disabled: false, rounded: true },
  { clicks: 0, color: 'secondary', disabled: false, rounded: true },
  { clicks: 0, color: 'error', disabled: false, rounded: true },
  { clicks: 0, color: 'warning', disabled: false, rounded: true },
  { clicks: 0, color: 'info', disabled: false, rounded: true },
  { clicks: 0, color: 'success', disabled: false, rounded: true },

  { clicks: 0, color: 'primary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'warning', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'success', variant: 'outlined', rounded: true },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },

  { clicks: 0, color: 'primary', variant: 'text', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'text', rounded: true },
  { clicks: 0, color: 'error', variant: 'text', rounded: true },
  { clicks: 0, color: 'warning', variant: 'text', rounded: true },
  { clicks: 0, color: 'info', variant: 'text', rounded: true },
  { clicks: 0, color: 'success', variant: 'text', rounded: true },

  { clicks: 0, color: 'primary', disabled: true, rounded: true },
  { clicks: 0, color: 'secondary', disabled: true, rounded: true },
  { clicks: 0, color: 'error', disabled: true, rounded: true },
  { clicks: 0, color: 'warning', disabled: true, rounded: true },
  { clicks: 0, color: 'info', disabled: true, rounded: true },
  { clicks: 0, color: 'success', disabled: true, rounded: true },

  { clicks: 0, color: 'primary', loading: true, rounded: true },
  { clicks: 0, color: 'secondary', loading: true, rounded: true },
  { clicks: 0, color: 'error', loading: true, rounded: true },
  { clicks: 0, color: 'warning', loading: true, rounded: true },
  { clicks: 0, color: 'info', loading: true, rounded: true },
  { clicks: 0, color: 'success', loading: true, rounded: true },

  { clicks: 0, color: 'primary', variant: 'fab' },
  { clicks: 0, color: 'secondary', variant: 'fab' },
  { clicks: 0, color: 'error', variant: 'fab' },
  { clicks: 0, color: 'warning', variant: 'fab' },
  { clicks: 0, color: 'info', variant: 'fab' },
  { clicks: 0, color: 'success', variant: 'fab' },

  {
    clicks: 0,
    color: 'primary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
]);

type ButtonGroupData = ButtonGroupProps & {
  count: number;
  rounded?: boolean;
};

const buttonGroups = ref<ButtonGroupData[]>([
  { count: 0, color: 'primary', gap: 'sm' },
  { count: 0, color: 'secondary', gap: 'md' },
  { count: 0, color: 'error', gap: 'lg' },
  { count: 0, color: 'warning' },
  { count: 0, color: 'info' },
  { count: 0, color: 'success' },

  { count: 0, color: 'primary', vertical: true, gap: 'sm' },
  { count: 0, color: 'secondary', vertical: true, gap: 'md' },
  { count: 0, color: 'error', vertical: true, gap: 'lg' },
  { count: 0, color: 'warning', vertical: true },
  { count: 0, color: 'info', vertical: true },
  { count: 0, color: 'success', vertical: true },

  { count: 0, color: 'primary', variant: 'outlined', gap: 'sm' },
  { count: 0, color: 'secondary', variant: 'outlined', gap: 'md' },
  { count: 0, color: 'error', variant: 'outlined', gap: 'lg' },
  { count: 0, color: 'warning', variant: 'outlined' },
  { count: 0, color: 'info', variant: 'outlined' },
  { count: 0, color: 'success', variant: 'outlined' },

  { count: 0, color: 'primary', variant: 'text' },
  { count: 0, color: 'secondary', variant: 'text' },
  { count: 0, color: 'error', variant: 'text' },
  { count: 0, color: 'warning', variant: 'text' },
  { count: 0, color: 'info', variant: 'text' },
  { count: 0, color: 'success', variant: 'text' },

  {
    count: 0,
    color: 'primary',
    variant: 'outlined',
    size: 'lg',
    gap: 'sm',
  },
  {
    count: 0,
    color: 'secondary',
    variant: 'outlined',
    size: 'lg',
    gap: 'md',
  },
  {
    count: 0,
    color: 'error',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
    gap: 'lg',
  },
  {
    count: 0,
    color: 'warning',
    variant: 'outlined',
    size: 'lg',
  },
  { count: 0, color: 'info', variant: 'outlined', rounded: true, size: 'lg' },
  {
    count: 0,
    color: 'success',
    variant: 'outlined',
    size: 'lg',
  },

  {
    count: 0,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    gap: 'sm',
  },
  {
    count: 0,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    gap: 'md',
  },
  {
    count: 0,
    color: 'error',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
    gap: 'lg',
  },
  {
    count: 0,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
  },
  { count: 0, color: 'info', variant: 'outlined', size: 'sm' },
  {
    count: 0,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
  },
]);

const toggleButtons = ref<ButtonGroupData[]>([
  { count: 0, color: 'primary', value: 0, activeColor: 'warning' },
  {
    count: 0,
    required: true,
    value: 0,
    gap: 'md',
    activeColor: 'primary',
  },
  { count: 0, color: 'primary', value: 0, disabled: true, gap: 'lg' },
  {
    count: 0,
    color: 'secondary',
    required: true,
    value: 0,
    disabled: true,
  },
  { count: 0, color: 'error', value: 0 },
  { count: 0, color: 'warning', required: true, value: 0 },
  { count: 0, color: 'info', value: 0 },
  { count: 0, color: 'success', required: true, value: 0 },
  { count: 0, color: 'primary', vertical: true, value: 0, gap: 'sm' },
  {
    count: 0,
    color: 'secondary',
    vertical: true,
    value: 0,
    gap: 'md',
  },
  { count: 0, color: 'error', vertical: true, value: 0, gap: 'lg' },
  { count: 0, color: 'warning', vertical: true, value: 0 },
  { count: 0, color: 'info', vertical: true, value: 0 },
  { count: 0, color: 'success', vertical: true, value: 0 },
  {
    count: 0,
    color: 'primary',
    variant: 'outlined',
    value: 0,
  },
  {
    count: 0,
    color: 'secondary',
    variant: 'outlined',
    value: 0,
    gap: 'md',
  },
  {
    count: 0,
    color: 'error',
    variant: 'outlined',
    value: 0,
    gap: 'lg',
  },
  {
    count: 0,
    color: 'warning',
    variant: 'outlined',
    value: 0,
  },
  {
    count: 0,
    color: 'info',
    variant: 'outlined',
    value: 0,
  },
  {
    count: 0,
    color: 'success',
    variant: 'outlined',
    value: 0,
  },
  { count: 0, color: 'primary', variant: 'text', value: 0 },
  {
    count: 0,
    color: 'secondary',
    variant: 'text',
    value: 0,
  },
  { count: 0, color: 'error', variant: 'text', value: 0 },
  { count: 0, color: 'warning', variant: 'text', value: 0 },
  { count: 0, color: 'info', variant: 'text', value: 0 },
  { count: 0, color: 'success', variant: 'text', value: 0 },
]);
const multipleToggleButtons = ref<ButtonGroupData[]>([
  {
    count: 0,
    color: 'primary',
    value: ['center'],
    gap: 'sm',
    activeColor: 'warning',
  },
  {
    count: 0,
    required: true,
    value: ['center'],
    gap: 'md',
    activeColor: 'warning',
  },
  { count: 0, color: 'primary', value: ['center'], disabled: true, gap: 'lg' },
  {
    count: 0,
    color: 'secondary',
    required: true,
    value: ['center'],
    disabled: true,
  },
  { count: 0, color: 'error', value: ['center'] },
  { count: 0, color: 'warning', required: true, value: ['center'] },
  { count: 0, color: 'info', value: ['center'] },
  { count: 0, color: 'success', required: true, value: ['center'] },
  { count: 0, color: 'primary', vertical: true, value: ['center'], gap: 'sm' },
  {
    count: 0,
    color: 'secondary',
    vertical: true,
    value: ['center'],
    gap: 'md',
  },
  { count: 0, color: 'error', vertical: true, value: ['center'], gap: 'lg' },
  { count: 0, color: 'warning', vertical: true, value: ['center'] },
  { count: 0, color: 'info', vertical: true, value: ['center'] },
  { count: 0, color: 'success', vertical: true, value: ['center'] },
  {
    count: 0,
    color: 'primary',
    variant: 'outlined',
    value: ['center'],
  },
  {
    count: 0,
    color: 'secondary',
    variant: 'outlined',
    value: ['center'],
  },
  {
    count: 0,
    color: 'error',
    variant: 'outlined',
    value: ['center'],
  },
  {
    count: 0,
    color: 'warning',
    variant: 'outlined',
    value: ['center'],
  },
  {
    count: 0,
    color: 'info',
    variant: 'outlined',
    value: ['center'],
  },
  {
    count: 0,
    color: 'success',
    variant: 'outlined',
    value: ['center'],
  },
  { count: 0, color: 'primary', variant: 'text', value: ['center'] },
  {
    count: 0,
    color: 'secondary',
    variant: 'text',
    value: ['center'],
  },
  { count: 0, color: 'error', variant: 'text', value: ['center'], gap: 'sm' },
  { count: 0, color: 'warning', variant: 'text', value: ['center'], gap: 'md' },
  { count: 0, color: 'info', variant: 'text', value: ['center'] },
  { count: 0, color: 'success', variant: 'text', value: ['center'] },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="buttons"
    >
      Buttons
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6 justify-items-start mb-14">
      <RuiButton
        v-for="(button, i) in buttons"
        :key="i"
        :class="{ 'w-full': !button.icon && button.variant !== 'fab' }"
        v-bind="button"
        @click="button.clicks++"
      >
        <template
          v-if="button.prepend"
          #prepend
        >
          <RuiIcon :name="button.prepend" />
        </template>
        <span
          v-if="!button.icon"
          class="capitalize"
        >
          {{ button.color }} {{ button.clicks }}
        </span>
        <RuiIcon
          v-else
          :name="button.iconName"
        />
        <template
          v-if="button.append"
          #append
        >
          <RuiIcon :name="button.append" />
        </template>
      </RuiButton>
    </div>
    <h2
      class="text-h4 mb-6"
      data-cy="button-groups"
    >
      Button Groups
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start mb-14">
      <div
        v-for="(buttonGroup, i) in buttonGroups"
        :key="i"
      >
        <RuiButtonGroup v-bind="objectOmit(buttonGroup, ['count', 'rounded'])">
          <RuiButton @click="buttonGroup.count--">
            Decrease
          </RuiButton>
          <RuiButton @click="buttonGroup.count++">
            Increase
          </RuiButton>
          <RuiButton @click="buttonGroup.count++">
            <RuiIcon name="add-fill" />
          </RuiButton>
        </RuiButtonGroup>
        <div class="mt-2">
          Counts: {{ buttonGroup.count }}
        </div>
      </div>
    </div>
    <h2
      class="text-h4 mb-6"
      data-cy="toggleable-button-groups"
    >
      Toggleable Button Groups
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start mb-14">
      <div
        v-for="(buttonGroup, i) in toggleButtons"
        :key="i"
      >
        <RuiButtonGroup
          v-model="buttonGroup.value"
          v-bind="objectOmit(buttonGroup, ['value', 'count', 'rounded'])"
        >
          <RuiButton>
            <RuiIcon name="align-left" />
          </RuiButton>
          <RuiButton>
            <RuiIcon name="align-center" />
          </RuiButton>
          <RuiButton>
            <RuiIcon name="align-right" />
          </RuiButton>
          <RuiButton>
            <RuiIcon name="align-justify" />
          </RuiButton>
        </RuiButtonGroup>
        <div
          v-if="buttonGroup.required"
          class="mt-2 text-rui-error"
        >
          required: *
        </div>
      </div>
    </div>
    <h2
      class="text-h4 mb-6"
      data-cy="multiple-toggleable-button-groups"
    >
      Multiple Toggleable Button Groups
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start">
      <div
        v-for="(buttonGroup, i) in multipleToggleButtons"
        :key="i"
      >
        <RuiButtonGroup
          v-model="buttonGroup.value"
          v-bind="objectOmit(buttonGroup, ['value', 'count', 'rounded'])"
        >
          <RuiButton
            value="left"
            disabled
          >
            <RuiIcon name="align-left" />
          </RuiButton>
          <RuiButton value="center">
            <RuiIcon name="align-center" />
          </RuiButton>
          <RuiButton value="right">
            <RuiIcon name="align-right" />
          </RuiButton>
          <RuiButton value="justify">
            <RuiIcon name="align-justify" />
          </RuiButton>
        </RuiButtonGroup>
        <div
          v-if="buttonGroup.required"
          class="mt-2 text-rui-error"
        >
          required: *
        </div>
      </div>
    </div>
  </div>
</template>
