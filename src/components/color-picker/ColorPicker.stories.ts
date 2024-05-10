import Card from '@/components/cards/Card.vue';
import { default as ColorPicker, type Props } from './ColorPicker.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<Props> = args => ({
  components: { Card, ColorPicker },
  setup() {
    const modelValue = computed({
      get() {
        return args.value;
      },
      set(val) {
        args.value = val;
      },
    });

    return { args, modelValue };
  },
  template: `<Card class='!w-[300px]'><ColorPicker v-model="modelValue" v-bind="args" /></Card>`,
});

const meta: Meta<Props> = {
  argTypes: {
    value: { control: 'text' },
  },
  component: ColorPicker,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/ColorPicker',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const PreDefinedValue: Story = {
  args: {
    value: '45858a',
  },
};

export default meta;
