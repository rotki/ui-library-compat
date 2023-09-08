// Use RouterLinkStub from latest version of vue-test-utils that support slot
// github.com/vuejs/test-utils/blob/69b55052553114f692f3233b0757084e3dec80fb/src/components/RouterLinkStub.ts#L4
//
import { computed, defineComponent, h } from 'vue';

// match return type of router.resolve: RouteLocation & { href: string }
const defaultRoute = {
  path: '/',
  name: undefined as string | undefined,
  redirectedFrom: undefined as object | undefined,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [] as object[],
  meta: {},
  href: '/',
};

// TODO: Borrow typings from vue-router-next
export const RouterLinkStub = defineComponent({
  name: 'RouterLinkStub',

  props: {
    to: {
      type: [String, Object],
      required: true,
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },

  render() {
    const route = computed(() => defaultRoute);
    // mock reasonable return values to mimic vue-router's useLink
    const children = this.$scopedSlots?.default?.({
      route,
      href: computed(() => route.value.href),
      isActive: computed(() => false),
      isExactActive: computed(() => false),
      navigate: async () => {},
    });
    return this.custom ? children : h('a', undefined, children);
  },
});
