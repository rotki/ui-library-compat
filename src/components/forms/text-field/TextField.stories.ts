import { contextColors } from '@/consts/colors';
import { type Props, default as TextField } from './TextField.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<Props> = args => ({
  components: { TextField },
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
  template: `<TextField v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    appendIcon: { control: 'text' },
    color: {
      control: 'select',
      options: ['grey', ...contextColors],
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    readonly: { control: 'boolean' },
    successMessages: { control: 'array', defaultValue: [] },
    textColor: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    value: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
  },
  component: TextField,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/TextField',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const Filled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    successMessages: ['With success messages'],
    variant: 'outlined',
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const WithPrependIcon: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    prependIcon: 'heart-fill',
    variant: 'outlined',
  },
};

export const WithAppendIcon: Story = {
  args: {
    appendIcon: 'heart-fill',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    readonly: true,
    value: 'Readonly text',
    variant: 'outlined',
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    label: 'Label',
    placeholder: 'Placeholder',
    value: 'Clearable text',
    variant: 'outlined',
  },
};

export const OutlinedWithNoLabel: Story = {
  args: {
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const OutlinedWithVeryLongLabel: Story = {
  args: {
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export default meta;
