<script setup lang="ts">
import {
  RuiCard,
  RuiIcon,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
  RuiTabs,
  type TabsProps,
} from '@rotki/ui-library-compat';
import { ref } from 'vue';

const tabs = ref<TabsProps[]>([
  {
    color: 'primary',
  },
  {
    color: 'secondary',
  },
  {
    color: 'error',
  },
  {
    color: 'warning',
  },
  {
    color: 'info',
  },
  {
    color: 'success',
  },
  {
    color: 'primary',
    vertical: true,
  },
  {
    color: 'secondary',
    vertical: true,
  },
  {
    color: 'error',
    vertical: true,
  },
  {
    color: 'warning',
    vertical: true,
  },
  {
    color: 'info',
    vertical: true,
  },
  {
    color: 'success',
    vertical: true,
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="tabs"
    >
      Tabs
    </h2>
    <div
      v-for="(data, i) in tabs"
      :key="i"
      :class="data.vertical ? 'flex-row' : 'flex-col'"
      :data-cy="`wrapper-${i}`"
      class="flex mb-6 gap-x-6"
    >
      <RuiTabs
        v-model="data.value"
        data-cy="tabs"
        v-bind="data"
      >
        <template #default>
          <RuiTab>
            <template #prepend>
              <RuiIcon name="add-fill" />
            </template>
            Tab 1
          </RuiTab>
          <RuiTab disabled>
            Tab 2
          </RuiTab>
          <RuiTab>Tab 3</RuiTab>
          <RuiTab>Tab 4</RuiTab>
          <RuiTab>Tab 5</RuiTab>
          <RuiTab
            link
            to="/steppers"
          >
            Stepper View
          </RuiTab>
        </template>
      </RuiTabs>
      <RuiTabItems
        v-model="data.value"
        data-cy="tab-items"
      >
        <template #default>
          <RuiTabItem>
            <RuiCard>Tab 1 Content</RuiCard>
          </RuiTabItem>
          <RuiTabItem>
            <RuiCard>Tab 2 Content</RuiCard>
          </RuiTabItem>
          <RuiTabItem>
            <RuiCard>Tab 3 Content</RuiCard>
          </RuiTabItem>
          <RuiTabItem>
            <RuiCard>Tab 4 Content</RuiCard>
          </RuiTabItem>
          <RuiTabItem>
            <RuiCard>
              Tab 5 Long Long Long Long Long Long Long Long Long Long Long Long
              Long Long Long Long Long Long Long Long Long Long Long Long Long
              Long Long Long Long Long Long Long Long Content
            </RuiCard>
          </RuiTabItem>
        </template>
      </RuiTabItems>
    </div>
  </div>
</template>
