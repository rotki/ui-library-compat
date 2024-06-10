import Button from '@/components/buttons/button/Button.vue';
import NavigationDrawer, { type NavigationDrawerProps } from './NavigationDrawer.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<NavigationDrawerProps> = args => ({
  components: { Button, NavigationDrawer },
  setup() {
    const value = computed({
      get() {
        return args.value;
      },
      set(val) {
        args.value = val;
      },
    });

    return { args, value };
  },
  template: `
    <NavigationDrawer v-bind="args" v-model='value'>
      <template #activator="{ on }">
        <Button v-on="on">
          Click me!
        </Button>
      </template>
      <div class="p-4">
        Navigation Drawer
      </div>
    </NavigationDrawer>
  `,
});

const meta: Meta<NavigationDrawerProps> = {
  args: {},
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right'],
      table: { category: 'State' },
    },
    temporary: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: NavigationDrawer,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/NavigationDrawer',
};

type Story = StoryObj<NavigationDrawerProps>;

export const Default: Story = {
  args: {
    temporary: true,
  },
};

export const Right: Story = {
  args: {
    position: 'right',
    temporary: true,
  },
};

export const Persistent: Story = {
  args: {},
};

export default meta;
