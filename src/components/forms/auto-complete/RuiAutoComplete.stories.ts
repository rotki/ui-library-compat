import RuiAutoComplete, { type Props } from './RuiAutoComplete.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

interface SelectOption {
  id: string | number;
  label: string | number;
}

const render: StoryFn<Props> = args => ({
  components: { RuiAutoComplete },
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
    <RuiAutoComplete v-bind="args" v-model="value" />`,
});

const options: SelectOption[] = [
  { id: '1', label: 'Germany' },
  { id: '2', label: 'Nigeria' },
  { id: '3', label: 'Greece' },
  { id: '4', label: 'Indonesia' },
  { id: '5', label: 'Spain' },
  { id: '6', label: 'India' },
  { id: '7', label: 'France' },
  { id: '8', label: 'England' },
  ...[...new Array(12).keys()].map(index => ({
    id: index + 9,
    label: index + 9,
  })),
];

const meta: Meta<Props> = {
  args: {
    disabled: false,
    options,
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    options: { control: 'array', defaultValue: [] },
    value: { control: 'string' },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined', 'filled'],
    },
  },
  component: RuiAutoComplete as any,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/AutoComplete',
};

type Story<T = SelectOption> = StoryObj<Props<T>>;

export const Default: Story = {
  args: {
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
  },
};

export const PrimitiveItems: Story<string> = {
  args: {
    options: options.map(item => item.label),
  },
};

export const MultipleValue: Story<string> = {
  args: {
    keyAtrr: 'id',
    textAttr: 'label',
    value: [],
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
  },
};

export const Outlined: Story = {
  args: {
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
    variant: 'outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
    variant: 'outlined',
  },
};

export const OutlinedDense: Story = {
  args: {
    dense: false,
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
    variant: 'outlined',
  },
};

export const OutlinedDisabledDense: Story = {
  args: {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    value: null,
    variant: 'outlined',
  },
};

export default meta;
