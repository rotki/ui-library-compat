import { type VueConstructor, provide } from 'vue';
import { isClient } from '@vueuse/core';
import { StepperState } from '@/types/stepper';
import { TeleportPlugin } from '@/components/overlays/teleport-container';
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
    table?: Partial<TableOptions>;
  };
}

function installTeleport() {
  if (!isClient)
    return;

  TeleportPlugin.install();
}

export function createRui(options: RuiOptions = {}) {
  const { theme } = options;

  const install = (_app: VueConstructor) => {
    const { registerIcons } = useIcons();
    registerIcons(theme?.icons || []);
    useRotkiTheme().init({ ...theme });
  };

  const setupProvide = () => {
    const tableDefaults = createTableDefaults(options.defaults?.table);
    provide(TableSymbol, tableDefaults);
    installTeleport();
  };

  return {
    install,
    setupProvide,
  };
}
