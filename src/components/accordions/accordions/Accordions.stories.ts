import Accordion from '@/components/accordions/accordion/Accordion.vue';
import Accordions, { type Props as AccordionsProps } from './Accordions.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<AccordionsProps> = args => ({
  components: { Accordion, Accordions },
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
      <Accordions v-bind="args" v-model='value'>
        <Accordion>
          <template #header>
            Accordion 1 header
          </template>
          <template #default>
            Accordion 1 content
          </template>
        </Accordion>
        <Accordion eager>
          <template #header>
            Accordion 2 header
          </template>
          <template #default>
            Accordion 2 content
          </template>
        </Accordion>
      </Accordions>
    </div>
  `,
});

const meta: Meta<AccordionsProps> = {
  argTypes: {
    multiple: { control: 'boolean', table: { category: 'State' } },
    value: { control: 'text' },
  },
  component: Accordions,
  render,
  tags: ['autodocs'],
  title: 'Components/Accordions',
};

type Story = StoryObj<AccordionsProps>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export default meta;
