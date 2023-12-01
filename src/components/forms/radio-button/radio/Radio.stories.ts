import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue';
import { contextColors } from '@/consts/colors';
import { default as Radio, type RadioProps } from './Radio.vue';

type PropsAndLabel = RadioProps & { label: string };

const render: StoryFn<PropsAndLabel> = (args) => ({
  components: { Radio },
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
  template: `<Radio v-bind="args" v-model="modelValue">
  {{ args.default }}
  </Radio>`,
});

const meta: Meta<PropsAndLabel> = {
  title: 'Components/Forms/Radio/Radio',
  component: Radio,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    internalValue: { control: 'text' },
    hint: { control: 'text' },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean' },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: { control: 'select', options: contextColors },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
};

type Story = StoryObj<PropsAndLabel>;

export const Checked: Story = {
  args: {
    value: '',
    internalValue: 'test',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    value: '',
    internalValue: 'test',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    value: '',
    internalValue: 'test',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    value: '',
    internalValue: 'test',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'With Label',
    value: '',
    internalValue: 'test',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
    internalValue: 'test',
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    errorMessages: ['With error messages'],
    internalValue: 'test',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Label',
    hint: 'With hint',
    internalValue: 'test',
  },
};

export const HideDetails: Story = {
  args: {
    label: 'Label',
    hint: 'Hint (should be invisible)',
    hideDetails: true,
    internalValue: 'test',
  },
};

export default meta;
