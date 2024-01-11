/* eslint-disable max-lines,import/max-dependencies */
import Vue, { type VueConstructor, provide } from 'vue';
import { isClient } from '@vueuse/core';
import { StepperState } from '@/types/stepper';
import { createTeleport } from '@/components/overlays/teleport-container';
import {
  type TableOptions,
  TableSymbol,
  createTableDefaults,
} from '@/composables/defaults/table';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.scss';

export * from '@/icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export { type ContextColorsType, contextColors } from '@/consts/colors';

export * from '@/composables';
export * from '@/components';

export { StepperState };

export interface RuiOptions {
  theme?: InitThemeOptions;
  defaults?: {
    table?: TableOptions;
  };
}

const installTeleport = () => {
  if (!isClient) {
    return;
  }

  const teleport = createTeleport();
  Object.defineProperty(Vue.prototype, '$teleport', {
    get() {
      return teleport;
    },
  });
};

export function createRui(options: RuiOptions = {}) {
  const { theme } = options;

  const install = (_app: VueConstructor) => {
    const { registerIcons } = useIcons();
    registerIcons(theme?.icons || []);
    useRotkiTheme().init({ ...theme });
    installTeleport();
  };

  const setupProvide = () => {
    const tableDefaults = createTableDefaults(options.defaults?.table);
    provide(TableSymbol, tableDefaults);
  };

  return {
    install,
    setupProvide,
  };
}
