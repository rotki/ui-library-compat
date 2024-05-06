import Button from '@/components/buttons/button/Button.vue';
import Card from '@/components/cards/Card.vue';
import Dialog, { type DialogProps } from './Dialog.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

const render: StoryFn<DialogProps> = args => ({
  components: { Button, Card, Dialog },
  setup() {
    return { args };
  },
  template: `
    <Dialog
      v-bind="args"
      width="900px"
    >
      <template #activator="{ on }">
        <Button v-on="on">
          Click me!
        </Button>
      </template>
      <template #default="{ close }">
        <Card no-padding>
          <template #header>
            Header
          </template>
          <template #subheader>
            Subheader
          </template>
  
          <div class="p-4 pb-0">
            <div class="h-[300px]">
              Contents
            </div>
  
            <div class="border-t border-default py-4">
              <div class="flex gap-2 w-full justify-end">
                <Button
                  variant="outlined"
                  color="primary"
                  @click="close()"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </template>
    </Dialog>
  `,
});

const meta: Meta<DialogProps> = {
  args: {
    maxWidth: '500px',
    persistent: false,
    width: '98%',
  },
  argTypes: {
    maxWidth: { control: 'text' },
    persistent: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: Dialog,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Dialog',
};

type Story = StoryObj<DialogProps>;

export const Default: Story = {
  args: {},
};

export const Persistent: Story = {
  args: {
    persistent: true,
  },
};

export const CustomMaxWidth: Story = {
  args: {
    maxWidth: '1000px',
  },
};

export default meta;
