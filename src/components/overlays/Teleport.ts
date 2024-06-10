export default defineComponent({
  name: 'RuiTeleport',
  props: {
    disabled: { default: false, type: Boolean },
    immediate: { default: false, type: Boolean },
  },
  render(_h) {
    return _h();
  },
  setup(props) {
    const { disabled } = toRefs(props);
    const slots = useSlots();

    const id = `#${generateId('tp')}`;

    const getTeleportContainer = () => {
      const proxy = getCurrentInstance()?.proxy;
      assert(proxy);
      return proxy?.$teleport;
    };

    const update = () => {
      const containerEl = getTeleportContainer();
      if (!get(disabled) && containerEl) {
        if (slots.default)
          containerEl.updateNodes(id, slots.default);
        else
          containerEl.clearNodes(id);
      }
    };

    onMounted(() => {
      if (!get(props.immediate))
        return;

      update();
    });

    onUpdated(() => {
      update();
    });

    onBeforeUnmount(() => {
      const teleport = getTeleportContainer();
      if (teleport)
        teleport.clearNodes(id);
    });
  },
});
