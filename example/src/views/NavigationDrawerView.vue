<script lang="ts" setup>
import { ref } from 'vue';
import { type NavigationDrawerProps, RuiButton, RuiNavigationDrawer } from '@rotki/ui-library-compat';

interface ExtraProperties {
  label: string;
}

type NavigationDrawerData = NavigationDrawerProps & ExtraProperties;
const navigationDrawers = ref<NavigationDrawerData[]>([
  { value: false, label: 'Left', temporary: true },
  { value: false, label: 'Right', position: 'right', temporary: true },
  { value: false, label: 'Persistent', temporary: false },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="navigation-drawers"
    >
      Navigation Drawers
    </h2>
    <div class="grid gap-4 grid-cols-2">
      <div
        v-for="(navigationDrawer, i) in navigationDrawers"
        :key="i"
        :data-cy="`navigation-drawer-${i}`"
      >
        <RuiNavigationDrawer
          v-bind="navigationDrawer"
          v-model="navigationDrawer.value"
          content-class="!top-16"
        >
          <template #activator="{ on }">
            <RuiButton
              color="primary"
              data-cy="activator"
              v-on="on"
            >
              {{ navigationDrawer.label }}
            </RuiButton>
          </template>

          <div class="p-4">
            {{ navigationDrawer.label }} Navigation Drawer
          </div>
        </RuiNavigationDrawer>
      </div>
    </div>
  </div>
</template>
