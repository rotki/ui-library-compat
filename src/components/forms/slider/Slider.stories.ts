import { contextColors } from '@/consts/colors';
import { type Props, default as Slider } from './Slider.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<Props> = args => ({
  components: { Slider },
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
  template: `<div>
    <Slider v-bind="args" v-model="value" />
    <div class="text-rui-text">Value: {{ value }}</div>
  </div>`,
});

const meta: Meta<Props> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hideTrack: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    showThumbLabel: { control: 'boolean', table: { category: 'State' } },
    showTicks: { control: 'boolean', table: { category: 'State' } },
    step: { control: 'number' },
    successMessages: { control: 'array', defaultValue: [] },
    value: { control: 'number' },
    vertical: { control: 'boolean', table: { category: 'State' } },
  },
  component: Slider,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Slider',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Label',
    value: 0,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    label: 'Label',
    value: 0,
  },
};

export const Vertical: Story = {
  args: {
    label: 'Label',
    value: 0,
    vertical: true,
  },
};

export const ShowThumbLabel: Story = {
  args: {
    label: 'Label',
    showThumbLabel: true,
    value: 0,
  },
};

export const ShowTicks: Story = {
  args: {
    label: 'Label',
    showTicks: true,
    value: 0,
  },
};

export const HideTrack: Story = {
  args: {
    hideTrack: true,
    label: 'Label',
    value: 0,
  },
};

export const TriStateStyle: Story = {
  args: {
    label: 'Label',
    max: 2,
    showTicks: true,
    sliderClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    step: 1,
    tickClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickSize: 12,
    value: 0,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Label',
    value: 0,
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
    label: 'Label',
    value: 0,
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    value: 0,
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    value: 0,
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Label',
    successMessages: ['With success messages'],
    value: 0,
  },
};

export default meta;
