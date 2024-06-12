import Button from '@/components/buttons/button/Button.vue';
import Card from '@/components/cards/Card.vue';
import Notification, { type NotificationProps } from '@/components/overlays/notification/Notification.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<NotificationProps> = args => ({
  components: { Button, Card, Notification },
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
    <div>
      <Button @click="value = !value"> Click </Button>
      <Notification v-bind="args" v-model='value'>
        <Card>I am a notification</Card>
      </Notification>
    </div>
  `,
});

const meta: Meta<NotificationProps> = {
  args: {},
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    timeout: { control: 'number' },
    width: { control: 'text' },
  },
  component: Notification,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Notification',
};

type Story = StoryObj<NotificationProps>;

export const Default: Story = {
  args: {
    timeout: 0,
    value: false,
  },
};

export const NonPersistent: Story = {
  args: {
    timeout: 0,
    value: false,
  },
};

export const Light: Story = {
  args: {
    theme: 'light',
    timeout: 0,
    value: false,
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
    timeout: 0,
    value: false,
  },
};

export const Persistent: Story = {
  args: {
    timeout: -1,
    value: false,
  },
};

export default meta;
