import '@/assets/main.css';
import '@rotki/ui-library-compat/style.css';
import '@fontsource/roboto/latin.css';

import { PiniaVuePlugin, createPinia, setActivePinia } from 'pinia';
import {
  RiAddFill,
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiCheckboxCircleLine,
  RiCloseFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiMacbookLine,
  RiMoonLine,
  RiSunLine,
  RuiPlugin,
} from '@rotki/ui-library-compat';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';

Vue.use(PiniaVuePlugin);
Vue.use(RuiPlugin, {
  icons: [
    RiMoonLine,
    RiSunLine,
    RiMacbookLine,
    RiArrowLeftLine,
    RiArrowRightLine,
    RiAddFill,
    RiAlertLine,
    RiCheckboxCircleLine,
    RiCloseFill,
    RiInformationLine,
    RiErrorWarningLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowUpSLine,
    RiArrowDownSLine,
  ],
});

const pinia = createPinia();
setActivePinia(pinia);

new Vue({
  // @ts-ignore
  pinia,
  router,
  render: (h) => h(App),
}).$mount('#app');
