import { defineComponent } from 'vue';

export default defineComponent({
  functional: true,
  render(_h, ctx) {
    const { vNode, key, ...props } = ctx.props;
    if (vNode.componentOptions) {
      if (!vNode.componentOptions.initialPropsData) {
        vNode.componentOptions.initialPropsData = {
          ...vNode.componentOptions.propsData,
        };
      }

      vNode.componentOptions.propsData = {
        ...vNode.componentOptions.initialPropsData,
        ...props,
      };

      vNode.componentOptions.listeners = {
        ...vNode.componentOptions.listeners,
        ...ctx.listeners,
      };
    }

    vNode.key = key;
    if (vNode.data.class) {
      vNode.data = {
        ...vNode.data,
        class: {
          [ctx.data.class]: true,
        },
      };
    }

    return vNode;
  },
});
