import path from 'node:path';
import rotki from '@rotki/eslint-config';

export default rotki({
  vue: {
    vueVersion: 2,
  },
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  stylistic: true,
  formatters: true,
  storybook: true,
  cypress: {
    testDirectory: path.join('example', 'cypress'),
  },
}, {
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
}, {
  files: ['src/**/*.stories.ts', '**/vue-shim.d.ts', '.storybook/**/*.ts'],
  rules: {
    'import/no-default-export': 'off',
  },
}, {
  files: ['src/**/*.@(ts|vue)'],
  rules: {
    'import/no-named-default': 'warn', // todo: fix and turn into an error
    'vue/no-restricted-v-bind': [
      'error',
      {
        argument: '/^v-(?!node)/',
        message: 'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.',
      },
    ],
  },
}, {
  files: ['**/*.ts'],
  rules: {
    'storybook/no-uninstalled-addons': 'off', // until storybook eslint official supports eslint 9
  },
});
