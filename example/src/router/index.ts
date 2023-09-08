import VueRouter from 'vue-router';
import Vue from 'vue';
import ButtonView from '@/views/ButtonView.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) {
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace(/#/, ''));
        if (element?.scrollIntoView) {
          element.scrollIntoView({
            block: 'start',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }
      }, 500);

      return { selector: to.hash };
    } else if (savedPosition) {
      return savedPosition;
    }

    if (from.path !== to.path) {
      document.body.scrollTo(0, 0);
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'buttons',
      component: ButtonView,
    },
    {
      path: '/icons',
      name: 'icons',
      component: () => import('@/views/IconView.vue'),
    },
    {
      path: '/checkboxes',
      name: 'checkboxes',
      component: () => import('@/views/CheckboxView.vue'),
    },
    {
      path: '/radios',
      name: 'radios',
      component: () => import('@/views/RadioView.vue'),
    },
    {
      path: '/text-fields',
      name: 'text-fields',
      component: () => import('@/views/TextFieldView.vue'),
    },
    {
      path: '/steppers',
      name: 'steppers',
      component: () => import('@/views/StepperView.vue'),
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/ProgressView.vue'),
    },
    {
      path: '/chips',
      name: 'chips',
      component: () => import('@/views/ChipView.vue'),
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@/views/AlertView.vue'),
    },
    {
      path: '/tooltips',
      name: 'tooltips',
      component: () => import('@/views/TooltipView.vue'),
    },
    {
      path: '/data-tables',
      name: 'data-tables',
      component: () => import('@/views/DataTableView.vue'),
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('@/views/CardView.vue'),
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: () => import('@/views/TabView.vue'),
    },
  ],
});

export default router;
