<script lang="ts" setup>
import {
  type RadioProps,
  RuiRadio,
  RuiRadioGroup,
} from '@rotki/ui-library-compat';
import { ref } from 'vue';

type RadioData = RadioProps;

const radios = ref<RadioData[]>([
  {
    internalValue: 'primary',
    value: 'primary',
    color: 'primary',
  },
  {
    internalValue: 'secondary',
    color: 'secondary',
  },
  {
    internalValue: 'error',
    color: 'error',
  },
  {
    internalValue: 'warning',
    color: 'warning',
  },
  {
    internalValue: 'info',
    color: 'info',
  },
  {
    internalValue: 'success',
    color: 'success',
  },
  {
    internalValue: 'primary',
    color: 'primary',
    label: 'primary',
  },
  {
    internalValue: 'secondary',
    color: 'secondary',
    label: 'secondary',
  },
  {
    internalValue: 'error',
    color: 'error',
    label: 'error',
  },
  {
    internalValue: 'warning',
    color: 'warning',
    label: 'warning',
  },
  {
    internalValue: 'info',
    color: 'info',
    label: 'info',
  },
  {
    internalValue: 'success',
    color: 'success',
    label: 'success',
  },
  {
    internalValue: 'primary',
    value: 'primary',
    color: 'primary',
    label: 'primary',
  },
  {
    internalValue: 'secondary',
    value: 'secondary',
    color: 'secondary',
    label: 'secondary',
  },
  {
    internalValue: 'error',
    value: 'error',
    color: 'error',
    label: 'error',
  },
  {
    internalValue: 'warning',
    value: 'warning',
    color: 'warning',
    label: 'warning',
  },
  {
    internalValue: 'info',
    value: 'info',
    color: 'info',
    label: 'info',
  },
  {
    internalValue: 'success',
    value: 'success',
    color: 'success',
    label: 'success',
  },
  {
    internalValue: 'primary',
    disabled: true,
    color: 'primary',
    label: 'primary',
  },
  {
    internalValue: 'secondary',
    disabled: true,
    color: 'secondary',
    label: 'secondary',
  },
  {
    internalValue: 'error',
    disabled: true,
    color: 'error',
    label: 'error',
  },
  {
    internalValue: 'warning',
    disabled: true,
    color: 'warning',
    label: 'warning',
  },
  {
    internalValue: 'info',
    disabled: true,
    color: 'info',
    label: 'info',
  },
  {
    internalValue: 'success',
    disabled: true,
    color: 'success',
    label: 'success',
  },
  {
    internalValue: 'primary',
    value: 'primary',
    disabled: true,
    color: 'primary',
    label: 'primary',
  },
  {
    internalValue: 'secondary',
    value: 'secondary',
    disabled: true,
    color: 'secondary',
    label: 'secondary',
  },
  {
    internalValue: 'error',
    value: 'error',
    disabled: true,
    color: 'error',
    label: 'error',
  },
  {
    internalValue: 'warning',
    value: 'warning',
    disabled: true,
    color: 'warning',
    label: 'warning',
  },
  {
    internalValue: 'info',
    value: 'info',
    disabled: true,
    color: 'info',
    label: 'info',
  },
  {
    internalValue: 'success',
    value: 'success',
    disabled: true,
    color: 'success',
    label: 'success',
  },
]);

const radioGroups = ref([
  {
    value: 'primary',
    options: [
      { color: 'primary', internalValue: 'primary' },
      { color: 'secondary', internalValue: 'secondary' },
      { color: 'error', internalValue: 'error' },
      { color: 'warning', internalValue: 'warning' },
      { color: 'info', internalValue: 'info' },
      { color: 'success', internalValue: 'success' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'sm', internalValue: 'primary' },
      { color: 'secondary', size: 'sm', internalValue: 'secondary' },
      { color: 'error', size: 'sm', internalValue: 'error' },
      { color: 'warning', size: 'sm', internalValue: 'warning' },
      { color: 'info', size: 'sm', internalValue: 'info' },
      { color: 'success', size: 'sm', internalValue: 'success' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'lg', internalValue: 'primary' },
      {
        color: 'secondary',
        size: 'lg',
        disabled: true,
        internalValue: 'secondary',
      },
      { color: 'error', size: 'lg', disabled: true, internalValue: 'error' },
      {
        color: 'warning',
        size: 'lg',
        disabled: true,
        internalValue: 'warning',
      },
      { color: 'info', size: 'lg', disabled: true, internalValue: 'info' },
      { color: 'success', size: 'lg', internalValue: 'success' },
    ],
  },
  {
    value: 'primary',
    errorMessages: 'This is error messages',
    options: [
      { color: 'primary', size: 'lg', internalValue: 'primary' },
      {
        color: 'secondary',
        size: 'lg',
        disabled: true,
        internalValue: 'secondary',
      },
      { color: 'error', size: 'lg', disabled: true, internalValue: 'error' },
      {
        color: 'warning',
        size: 'lg',
        disabled: true,
        internalValue: 'warning',
      },
      { color: 'info', size: 'lg', disabled: true, internalValue: 'info' },
      { color: 'success', size: 'lg', internalValue: 'success' },
    ],
  },
  {
    value: 'primary',
    successMessages: 'This is success messages',
    options: [
      { color: 'primary', size: 'lg', internalValue: 'primary' },
      {
        color: 'secondary',
        size: 'lg',
        disabled: true,
        internalValue: 'secondary',
      },
      { color: 'error', size: 'lg', disabled: true, internalValue: 'error' },
      {
        color: 'warning',
        size: 'lg',
        disabled: true,
        internalValue: 'warning',
      },
      { color: 'info', size: 'lg', disabled: true, internalValue: 'info' },
      { color: 'success', size: 'lg', internalValue: 'success' },
    ],
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="radio-buttons">Radio Buttons</h2>
    <div class="grid gap-4 grid-cols-6 mb-14" data-cy="radio-wrapper">
      <RuiRadio
        v-for="(radio, j) in radios"
        :key="j"
        v-model="radio.value"
        v-bind="radio"
      >
        <span v-if="radio.label" class="capitalize"> {{ radio.label }} </span>
      </RuiRadio>
    </div>
    <h2 class="text-h4 mb-6" data-cy="radio-group-buttons">Radio Groups</h2>
    <div class="grid gap-8" data-cy="radio-group-wrapper">
      <RuiRadioGroup
        v-for="(radioGroup, i) in radioGroups"
        :key="i"
        v-bind="radioGroup"
        v-model="radioGroup.value"
        :hint="`Selected value: ${radioGroup.value}`"
        inline
      >
        <RuiRadio
          v-for="(radio, j) in radioGroup.options"
          :key="j"
          v-bind="radio"
        >
          <span class="capitalize"> {{ radio.color }} </span>
        </RuiRadio>
      </RuiRadioGroup>
    </div>
  </div>
</template>
