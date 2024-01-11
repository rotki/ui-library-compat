import { createRui } from '../src';
import * as Icons from '../src/icons';
import Vue, { ref } from 'vue';

const RuiPlugin = createRui({
  theme: {
    icons: Object.values(Icons),
  },
  defaults: {
    table: {
      itemsPerPage: ref(10),
      globalItemsPerPage: false,
      limits: [5, 10, 15, 25, 50, 100, 200],
    }
  },
})

Vue.use(RuiPlugin);

export const vueInstance = new Vue({
  template: '<div />',
  setup() {
    RuiPlugin.setupProvide();
  }
}).$mount();
