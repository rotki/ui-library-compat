/* eslint-disable max-lines */
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';
import { TableSymbol, createTableDefaults } from '@/composables/defaults/table';
import Button from '@/components/buttons/button/Button.vue';
import TextField from '@/components/forms/text-field/TextField.vue';
import Icon from '@/components/icons/Icon.vue';
import Card from '@/components/cards/Card.vue';
import DataTable, { type Props } from './DataTable.vue';
import type { TableColumn } from './TableHead.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue';

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
  role: string;
  date: string;
}

const render: StoryFn<Props> = args => ({
  components: { Button, Card, DataTable, Icon, TextField },
  provide: {
    [TableSymbol.valueOf()]: createTableDefaults({
      globalItemsPerPage: false,
      itemsPerPage: ref(10),
      limits: [5, 10, 15, 25, 50, 100, 200],
    }),
  },
  setup() {
    const value = computed({
      get() {
        return args.value;
      },
      set(val) {
        args.value = val;
      },
    });
    const pagination = computed({
      get() {
        return args.pagination;
      },
      set(val) {
        args.pagination = val;
      },
    });
    const sort = computed({
      get() {
        return args.sort;
      },
      set(val) {
        args.sort = val;
      },
    });
    const search = computed({
      get() {
        return args.search;
      },
      set(val) {
        args.search = val;
      },
    });
    const expanded = computed({
      get() {
        return args.expanded;
      },
      set(val) {
        args.expanded = val;
      },
    });
    const group = computed({
      get() {
        return args.group;
      },
      set(val) {
        args.group = val;
      },
    });
    const collapsed = computed({
      get() {
        return args.collapsed;
      },
      set(val) {
        args.collapsed = val;
      },
    });

    return {
      args,
      collapsed,
      expanded,
      group,
      objectOmit,
      pagination,
      search,
      sort,
      value,
    };
  },
  template: `<div class="flex flex-col space-y-4">
      <div class="flex items-center space-x-4">
        <TextField
          v-if="search !== undefined"
          v-model="search"
          placeholder="search"
          label="search"
          class="w-1/2 lg:w-2/5"
          variant="outlined"
          color="primary"
          hide-details
        />
        <span v-if="value">selected: {{ value.length }}</span>
      </div>
      <DataTable
        v-bind="
                objectOmit(args, [
                  'value',
                  'pagination',
                  'sort',
                  'expanded',
                  'group',
                  'collapsed',
                ])
            "
        v-model="value"
        :pagination.sync="pagination"
        :sort.sync="sort"
        :search="search"
        :expanded.sync="expanded"
        :group.sync="group"
        :collapsed.sync="collapsed"
      >
        <template #item.action>
          <Button icon variant="text" size="sm">
            <Icon name="more-fill" color="primary" />
          </Button>
        </template>
        <template v-if="args.expanded" #expanded-item>
          <Card>
            <template #header> Expanded content</template>
            <DataTable
              v-bind="
                    objectOmit(args, [
                      'modelValue',
                      'pagination',
                      'sort',
                      'expanded',
                      'group',
                      'collapsed',
                    ])
                  "
            />
          </Card>
        </template>
      </DataTable>
    </div>`,
});

const data: User[] = [
  {
    date: '10.09.2023',
    email: 'Lefteris@example.com',
    id: 1,
    name: 'Lefteris',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Kelsos@example.com',
    id: 2,
    name: 'Kelsos',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Yabir@example.com',
    id: 3,
    name: 'Yabir',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Luki@example.com',
    id: 4,
    name: 'Luki',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Celina@example.com',
    id: 5,
    name: 'Celina',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Joseph@example.com',
    id: 6,
    name: 'Joseph',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Dimitry@example.com',
    id: 7,
    name: 'Dimitry',
    role: 'Member',
    title: 'Director of Product',
  },
  ...[...new Array(43)].map((_, index) => ({
    date: '10.09.2023',
    email: 'lindsay.walton@example.com',
    id: index + 8,
    name: 'Lindsay Walton',
    role: 'Member',
    title: 'Front-end Developer',
  })),
];

const columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    align: 'end',
    key: 'name',
    label: 'Full name',
    sortable: true,
  },
  {
    align: 'start',
    key: 'title',
    label: 'Job position',
    sortable: true,
  },
  {
    align: 'center',
    key: 'email',
    label: 'Email address',
    sortable: true,
  },
  {
    key: 'role',
    sortable: true,
  },
  {
    key: 'action',
  },
];

const meta: Meta<Props> = {
  args: {
    columnAttr: 'label',
    dense: false,
    loading: false,
    outlined: false,
    rowAttr: 'id',
    rows: [],
    striped: false,
    value: undefined,
  },
  argTypes: {
    rounded: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
  component: DataTable,
  parameters: {
    docs: {
      controls: {
        exclude: [
          'default',
          'input',
          'update:pagination',
          'update:sort',
          'tfoot',
          'no-data',
          'empty-description',
          /* eslint-disable no-template-curly-in-string */
          'header.`${column.key}`',
          'item.`${column.key}`',
          /* eslint-enable no-template-curly-in-string */
          'body.append',
          'item.expand',
          'group.header',
          'expanded-item',
        ],
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Tables/DataTable',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: [{ column: 'name', direction: 'asc' }],
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    rows: data,
  },
};

export const Loading: Story = {
  args: {
    cols: columns,
    loading: true,
    rows: [],
  },
};

export const WithColumnDefinitions: Story = {
  args: {
    cols: columns,
    rows: data,
  },
};

export const Selectable: Story = {
  args: {
    cols: columns,
    rows: data,
    value: [],
  },
};

export const SelectableAndDense: Story = {
  args: {
    cols: columns,
    dense: true,
    rows: data,
    value: [],
  },
};

export const WithPagination: Story = {
  args: {
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    value: [],
  },
};

export const ColumnsWithPagination: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    value: [],
  },
};

export const Outlined: Story = {
  args: {
    cols: columns,
    outlined: true,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    value: [],
  },
};

export const Striped: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    striped: true,
    value: [],
  },
};

export const SingleSort: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: { column: 'name', direction: 'asc' },
    value: [],
  },
};

export const MultipleSort: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const LoadingWithData: Story = {
  args: {
    cols: columns,
    loading: true,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const LoadingWithoutData: Story = {
  args: {
    cols: columns,
    loading: true,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    rows: [],
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const EmptyState: Story = {
  args: {
    cols: columns,
    empty: {
      description: 'Start by adding an account',
      label: 'No item found',
    },
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    rows: [],
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const Expandable: Story = {
  args: {
    cols: columns,
    expanded: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const SingleExpandable: Story = {
  args: {
    cols: columns,
    expanded: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    singleExpand: true,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export const StickyHeader: Story = {
  args: {
    cols: columns,
    expanded: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    singleExpand: true,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    stickyHeader: true,
    stickyOffset: 40,
    value: [],
  },
};

export const Grouped: Story = {
  args: {
    collapsed: [],
    cols: columns,
    expanded: [],
    group: 'name',
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    value: [],
  },
};

export default meta;
