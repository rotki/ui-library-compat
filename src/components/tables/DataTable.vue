<script lang="ts" setup>
import { type ComputedRef, type Ref } from 'vue';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';
import ExpandButton from '@/components/tables/ExpandButton.vue';
import TablePagination, {
  type TablePaginationData,
} from './TablePagination.vue';
import TableHead, {
  type SortColumn,
  type TableColumn,
  type TableRow,
  type TableRowKey,
  type TableSortData,
} from './TableHead.vue';

export interface TableOptions {
  pagination?: TablePaginationData;
  sort?: TableSortData;
}

export interface GroupData {
  key: TableRowKey;
  value: any;
}

export interface Props {
  /**
   * list of items for each row
   */
  rows: TableRow[];
  /**
   * the attribute used to identify each row uniquely for selection, usually `id`
   */
  rowAttr: TableRowKey;
  /**
   * model for selected rows, add a v-model to support row selection
   */
  value?: string[];
  /**
   * model for internal searching
   */
  search?: string;
  /**
   * model for items per page
   * will be used if the `pagination` model isn't specified
   */
  itemsPerPage?: number;
  /**
   * model for paginating data
   * @example v-model:pagination="{ total: 10, limit: 5, page: 1 }"
   */
  pagination?: TablePaginationData;
  /**
   * modifiers for specifying externally paginated tables
   * use this when api controls pagination
   * @example v-model:pagination.external="{ total: 10, limit: 5, page: 1 }"
   */
  paginationModifiers?: {
    external: boolean;
  };
  /**
   * model for sort column/columns data
   * single column sort
   * @example v-model:sort="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort="[{ column: 'name', direction: 'asc' }]"
   */
  sort?: TableSortData;
  /**
   * modifiers for specifying externally sorted tables
   * use this when api controls sorting
   * single column sort
   * @example v-model:sort.external="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort.external="[{ column: 'name', direction: 'asc' }]"
   */
  sortModifiers?: {
    external: boolean;
  };
  /**
   * list of column definitions
   */
  cols?: TableColumn[];
  /**
   * attribute to use from column definitions to display column titles
   */
  columnAttr?: keyof TableColumn;
  /**
   * flag to show a more or less spacious table
   */
  dense?: boolean;
  /**
   * flag to outline the flag with a border
   */
  outlined?: boolean;
  /**
   * flag to show loading state of the table
   * triggers indefinite progress at the bottom of the table header
   */
  loading?: boolean;
  /**
   * data to display for empty state
   * text and icon
   * @example :empty="{ icon: 'transactions-line', label: 'No transactions found' }"
   */
  empty?: {
    label?: string;
    description?: string;
  };

  rounded?: 'sm' | 'md' | 'lg';
  /**
   * should hide the footer
   */
  hideDefaultFooter?: boolean;
  /**
   * should add zebra-striping to the table row
   */
  striped?: boolean;
  /**
   * model for expanded rows
   */
  expanded?: TableRow[];
  /**
   * make expansion work like accordion
   */
  singleExpand?: boolean;
  /**
   * make table head stick to top on scroll
   */
  stickyHeader?: boolean;
  stickyOffset?: number;
  /**
   * Affects how the items per page work across the app.
   * When true, changing the items per page setting in one table will affect other tables.
   */
  globalItemsPerPage?: boolean;
  /**
   * model for grouping column/columns data
   * single column grouping
   * @example v-model:group="'name'"
   * multi columns grouping
   * @example v-model:group="['name', 'country']"
   */
  group?: TableRowKey | TableRowKey[];
  collapsed?: TableRow[];
}

defineOptions({
  name: 'RuiDataTable',
});

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  search: '',
  cols: undefined,
  itemsPerPage: 10,
  pagination: undefined,
  columnAttr: 'label',
  sort: undefined,
  loading: false,
  dense: false,
  outlined: false,
  paginationModifiers: undefined,
  sortModifiers: undefined,
  empty: () => ({ description: 'No item found' }),
  rounded: 'md',
  hideDefaultFooter: false,
  striped: false,
  expanded: undefined,
  singleExpand: false,
  stickyHeader: false,
  stickyOffset: 0,
  globalItemsPerPage: undefined,
  group: undefined,
  collapsed: undefined,
  customGroupBy: undefined,
});

const emit = defineEmits<{
  (e: 'input', value?: Props['value']): void;
  (e: 'update:expanded', value?: Props['expanded']): void;
  (e: 'update:pagination', value: Props['pagination']): void;
  (e: 'update:sort', value?: Props['sort']): void;
  (e: 'update:options', value: TableOptions): void;
  (e: 'update:group', value?: Props['group']): void;
  (e: 'update:collapsed', value?: Props['collapsed']): void;
  (e: 'copy:group', value: GroupData): void;
}>();

const {
  cols,
  rows,
  value,
  columnAttr,
  rowAttr,
  itemsPerPage,
  pagination,
  paginationModifiers,
  search,
  sort,
  loading,
  sortModifiers,
  expanded,
  singleExpand,
  stickyOffset,
  stickyHeader,
  group,
  collapsed,
} = toRefs(props);

const css = useCssModule();
const slots = useSlots();
const { stick, table, tableScroller } = useStickyTableHeader(
  stickyOffset,
  stickyHeader,
);
const tableDefaults = useTable();

const headerSlots = computed(() =>
  Object.keys(slots).filter((slotName) => slotName.startsWith('header.')),
);

const globalItemsPerPageSettings = computed(() => {
  if (props.globalItemsPerPage !== undefined) {
    return props.globalItemsPerPage;
  }
  return get(tableDefaults.globalItemsPerPage);
});

/**
 * Prepare the columns from props or generate using first item in the list
 */
const columns = computed<TableColumn[]>(() => {
  const data =
    get(cols) ??
    Object.keys(get(rows)[0] ?? {}).map((key) => ({
      key,
      [get(columnAttr)]: key,
      sortable: false,
      class: '',
    }));

  if (get(expandable)) {
    return [
      ...data,
      {
        key: 'expand',
        sortable: false,
        class: 'w-16',
        cellClass: '!py-0 w-16',
        align: 'end',
      },
    ];
  }

  const groupByKeys = get(groupKeys);

  if (groupByKeys.length === 0) {
    return data;
  }

  return data.filter((column) => !groupByKeys.includes(column.key));
});

const selectedData = computed({
  get() {
    return get(value);
  },
  set(value) {
    emit('input', value);
  },
});

const internalPaginationState: Ref<TablePaginationData | undefined> = ref();
const collapsedRows: Ref<TableRow[]> = ref([]);

watchImmediate(pagination, (pagination) => {
  set(internalPaginationState, pagination);
});

watchImmediate(collapsed, (value) => {
  set(collapsedRows, value ?? []);
});

const expandable = computed(() => get(expanded) && slots['expanded-item']);

/**
 * Keeps the global items per page in sync with the internal state.
 */
watch(internalPaginationState, (pagination) => {
  if (pagination?.limit && get(globalItemsPerPageSettings)) {
    set(tableDefaults.itemsPerPage, pagination.limit);
  }
});

watch(tableDefaults.itemsPerPage, (itemsPerPage) => {
  if (!get(globalItemsPerPageSettings)) {
    return;
  }
  set(paginationData, {
    ...get(paginationData),
    limit: itemsPerPage,
  });
});

/**
 * Pagination is different for search
 * since search is only used for internal filtering
 * we return the length of search results as total
 */
const paginationData: Ref<TablePaginationData> = computed({
  get() {
    const paginated = get(internalPaginationState);
    if (!paginated) {
      return {
        total: get(searchData).length,
        limit: get(itemsPerPage),
        page: 1,
      };
    }

    if (get(paginationModifiers)?.external) {
      return paginated;
    }

    return {
      total: get(searchData).length,
      limit: paginated.limit,
      page: paginated.page,
      limits: paginated.limits,
    };
  },
  set(value: TablePaginationData) {
    set(internalPaginationState, value);
    emit('update:pagination', value);
    emit('update:options', {
      pagination: value,
      sort: get(sort),
    });
  },
});

const sortData = computed({
  get() {
    return get(sort);
  },
  set(value) {
    emit('update:sort', value);
    emit('update:options', {
      sort: value,
      pagination: get(pagination),
    });
  },
});

/**
 * A mapping of the sort columns
 * for easily checking if a column is sorted instead of looping through the array
 */
const sortedMap = computed(() => {
  const mapped: Record<TableRowKey, SortColumn> = {};
  const sortBy = get(sortData);
  if (!sortBy) {
    return mapped;
  }

  if (!Array.isArray(sortBy)) {
    if (sortBy.column) {
      mapped[sortBy.column] = sortBy;
    }
    return mapped;
  }

  return sortBy.reduce((acc, curr) => {
    if (!curr.column) {
      return acc;
    }

    return { ...acc, [curr.column]: curr };
  }, mapped);
});

/**
 * list if ids of the visible table rows used for check-all and uncheck-all
 */
const visibleIdentifiers = computed(() => {
  const selectBy = get(rowAttr);

  if (!selectBy) {
    return [];
  }

  return get(filtered)?.map((row) => row[selectBy]) ?? [];
});

/**
 * Flag to know when all rows are selected for the current screen
 */
const isAllSelected = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }

  return (
    selectedRows.length > 0 &&
    get(visibleIdentifiers).every((id) => selectedRows.includes(id))
  );
});

/**
 * rows filtered based on search query if it exists
 */
const searchData: ComputedRef<TableRow[]> = computed(() => {
  const query = get(search)?.toLocaleLowerCase();
  if (!query) {
    return get(rows);
  }

  return get(rows).filter((row) =>
    Object.keys(row).some((key) =>
      `${row[key]}`.toLocaleLowerCase().includes(query),
    ),
  );
});

/**
 * sort the search results
 */
const sorted: ComputedRef<TableRow[]> = computed(() => {
  const sortBy = get(sortData);
  const data = [...get(searchData)];
  if (!sortBy || get(sortModifiers)?.external) {
    return data;
  }

  const sortOptions: Intl.CollatorOptions = {
    numeric: true,
    ignorePunctuation: true,
  };

  const sort = (by: SortColumn) => {
    data.sort((a, b) => {
      const column = by.column;
      if (!column) {
        return 0;
      }
      if (by.direction === 'desc') {
        return `${b[column]}`.localeCompare(
          `${a[column]}`,
          undefined,
          sortOptions,
        );
      }

      return `${a[column]}`.localeCompare(
        `${b[column]}`,
        undefined,
        sortOptions,
      );
    });
  };

  if (!Array.isArray(sortBy)) {
    sort(sortBy);
  } else {
    sortBy.forEach(sort);
  }

  return data;
});

/**
 * comprises search, sorted and paginated data
 */
const filtered: ComputedRef<TableRow[]> = computed(() => {
  const result = get(sorted);

  const paginated = get(paginationData);
  const limit = paginated.limit;
  if (paginated && !get(paginationModifiers)?.external) {
    const start = (paginated.page - 1) * limit;
    const end = start + limit;
    return result.slice(start, end);
  }

  return result;
});

const groupKeys = computed(() => {
  const groupBy = get(group);

  if (!groupBy) {
    // no grouping
    return [];
  }

  if (!Array.isArray(groupBy)) {
    // currently only supports a single grouping
    // only the first item in the array is used
    return [groupBy];
  }

  return groupBy;
});

const groupKey = computed(() => get(groupKeys).join(':'));

const isGrouped = computed(() => !!get(groupKey));

/**
 * comprises search, sorted paginated, and grouped data
 */
const mappedGroups: ComputedRef<Record<string, TableRow[]>> = computed(() => {
  if (!get(isGrouped)) {
    // no grouping
    return {};
  }

  const result = get(filtered);
  const identifier = get(rowAttr);

  return result.reduce((acc, row) => {
    if (!isDefined(row[identifier]) || row[identifier] === '') {
      return acc;
    }

    const group = getRowGroup(row);
    const groupVal = Object.values(group).filter(isDefined).join(',');
    if (!acc[groupVal]) {
      acc[groupVal] = [
        {
          [identifier]: 'group.header',
          group,
          groupVal,
        },
      ];
    }

    acc[groupVal].push(row);

    return acc;
  }, {});
});

/**
 * comprises search, sorted paginated, and grouped data
 */
const grouped: ComputedRef<TableRow[]> = computed(() => {
  const result = get(filtered);
  const groupByKey = get(groupKey);

  if (!groupByKey) {
    // no grouping
    return result;
  }

  return Object.values(get(mappedGroups)).flatMap((grouped) => grouped);
});

const filteredMap = computed(() =>
  get(filtered).map((row) => row[get(rowAttr)]),
);

const indeterminate = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }
  return selectedRows.length > 0 && !get(isAllSelected);
});

const noData = computed(() => get(filtered).length === 0);

const colspan = computed(() => {
  let columnLength = get(columns).length;
  if (get(selectedData)) {
    columnLength++;
  }

  return columnLength;
});

const isSortedBy = (key: TableRowKey) => key in get(sortedMap);

const getSortIndex = (key: TableRowKey) => {
  const sortBy = get(sortData);

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key)) {
    return -1;
  }

  return sortBy.findIndex((sort) => sort.column === key) ?? -1;
};

const isSelected = (identifier: string) => {
  const selection = get(selectedData);
  if (!selection) {
    return false;
  }

  return selection.includes(identifier);
};

const isExpanded = (identifier: string) => {
  const expandedRows = get(expanded);
  if (!expandedRows?.length) {
    return false;
  }

  return expandedRows.some((data) => data[get(rowAttr)] === identifier);
};

const onToggleExpand = (row: TableRow) => {
  const expandedRows = get(expanded);
  if (!expandedRows) {
    return;
  }

  const key = get(rowAttr);
  const rowExpanded = isExpanded(row[key]);

  if (get(singleExpand)) {
    return emit('update:expanded', rowExpanded ? [] : [row]);
  }

  return emit(
    'update:expanded',
    rowExpanded
      ? expandedRows.filter((item) => item[key] !== row[key])
      : [...expandedRows, row],
  );
};

const getRowGroup = (row: TableRow) => {
  const group = get(groupKeys);
  const result: Record<keyof TableRow, any> = {};
  if (group.length === 0) {
    return result;
  }

  return group.reduce<Record<keyof TableRow, any>>(
    (acc, key) => ({ ...acc, [key]: row[key] }),
    result,
  );
};

const getGroupRows = (groupVal: string) => {
  if (!get(isGrouped)) {
    return [];
  }

  return get(mappedGroups)[groupVal].filter(
    (row) => row[get(rowAttr)] !== 'group.header',
  );
};

const compareGroupsFn = (a: TableRow, b: TableRow) => {
  const group = get(groupKeys);
  if (group.length === 0) {
    return false;
  }

  return group.every((key) => a[key] === b[key]);
};

const isExpandedGroup = (value: any) =>
  get(collapsedRows).every((row) => !compareGroupsFn(row, value));

const isHiddenRow = (row: TableRow) => get(isGrouped) && !isExpandedGroup(row);

const onToggleExpandGroup = (group: any, value: string) => {
  const collapsed = get(collapsedRows);

  const groupExpanded = isExpandedGroup(group);

  const groupRows = getGroupRows(value);

  set(
    collapsedRows,
    groupExpanded
      ? [...collapsed, ...groupRows]
      : collapsed.filter((row) => !compareGroupsFn(row, group)),
  );

  emit('update:collapsed', get(collapsedRows));
};

const onUngroup = () => {
  set(collapsedRows, []);

  emit('update:collapsed', []);
  emit('update:group', Array.isArray(get(group)) ? [] : undefined);
};

const onCopyGroup = (value: GroupData) => {
  emit('copy:group', value);
};

/**
 * Sort to handle single sort or multiple sort columns
 */
const onSort = ({
  key,
  direction,
}: {
  key: TableRowKey;
  direction?: 'asc' | 'desc';
}) => {
  const sortBy = get(sortData);
  if (!sortBy) {
    return;
  }

  if (!Array.isArray(sortBy)) {
    if (isSortedBy(key)) {
      const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

      if (sortBy.direction === newDirection) {
        set(sortData, { ...sortBy, column: undefined, direction: 'asc' });
      } else {
        set(sortData, {
          ...sortBy,
          direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
        });
      }
    } else {
      set(sortData, { column: key, direction: direction ?? 'asc' });
    }
    return;
  }

  if (isSortedBy(key)) {
    const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

    const index = getSortIndex(key);
    const sortByCol = sortBy[index];

    if (sortByCol.direction === newDirection) {
      sortBy.splice(index, 1);
    } else {
      sortByCol.direction = sortByCol.direction === 'asc' ? 'desc' : 'asc';
    }
    set(sortData, sortBy);
  } else {
    set(sortData, [...sortBy, { column: key, direction: direction ?? 'asc' }]);
  }
};

/**
 * toggles selected rows
 * @param {boolean} checked checkbox state
 */
const onToggleAll = (checked: boolean) => {
  if (checked) {
    set(
      selectedData,
      Array.from(
        new Set([...(get(selectedData) ?? []), ...get(visibleIdentifiers)]),
      ),
    );
  } else {
    set(
      selectedData,
      get(selectedData)?.filter(
        (identifier) => !get(filteredMap).includes(identifier),
      ),
    );
  }
};

/**
 * toggles a single row
 * @param {boolean} checked checkbox state
 * @param {string} value the id of the selected row
 */
const onSelect = (checked: boolean, value: string) => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }

  if (checked) {
    set(selectedData, [...selectedRows, value]);
  } else {
    set(
      selectedData,
      [...selectedRows].filter((r) => r !== value),
    );
  }
};

/**
 * on changing search query, need to reset pagination page to 1
 */
watch(search, () => {
  const pagination = get(paginationData);
  if (pagination) {
    pagination.page = 1;
  }
});

onMounted(() => {
  if (!get(globalItemsPerPageSettings)) {
    return;
  }
  set(paginationData, {
    ...get(paginationData),
    limit: get(tableDefaults.itemsPerPage),
  });
});
</script>

<template>
  <div
    :class="[
      css.wrapper,
      css[`rounded__${rounded}`],
      { [css.outlined]: outlined },
    ]"
  >
    <div ref="tableScroller" :class="css.scroller">
      <table
        ref="table"
        :class="[css.table, { [css.dense]: dense }]"
        aria-label=""
      >
        <TableHead
          :loading="loading"
          :indeterminate="indeterminate"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
          :disable-check-all="!filtered?.length"
          :is-all-selected="isAllSelected"
          :no-data="noData"
          :selectable="!!selectedData"
          :sort-data="sortData"
          :sorted-map="sortedMap"
          :stick="stick"
          :sticky-header="stickyHeader"
          data-id="head-main"
          @sort="onSort($event)"
          @select:all="onToggleAll($event)"
        >
          <template v-for="headerSlot in headerSlots" #[headerSlot]="slotData">
            <slot :name="headerSlot" v-bind="slotData" />
          </template>
        </TableHead>
        <TableHead
          v-if="stickyHeader"
          :loading="loading"
          :indeterminate="indeterminate"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
          :disable-check-all="!filtered?.length"
          :is-all-selected="isAllSelected"
          :no-data="noData"
          :selectable="!!selectedData"
          :sort-data="sortData"
          :sorted-map="sortedMap"
          data-id="head-clone"
          class="opacity-0 invisible"
        >
          <template v-for="headerSlot in headerSlots" #[headerSlot]="slotData">
            <slot :name="headerSlot" v-bind="slotData" />
          </template>
        </TableHead>
        <tbody :class="[css.tbody, { [css['tbody--striped']]: striped }]">
          <slot
            v-if="slots['body.prepend'] && !(loading && noData)"
            :colspan="colspan"
            name="body.prepend"
          />
          <template v-for="(row, index) in grouped">
            <tr
              v-if="row[rowAttr] === 'group.header'"
              :key="`row-${index}`"
              :class="[css.tr, css.tr__group]"
            >
              <slot
                name="group.header"
                :colspan="colspan"
                :row="row"
                :group="row.group"
                :group-key="groupKey"
                :group-value="row.groupVal"
                :is-open="isExpandedGroup(row.group)"
                :toggle="() => onToggleExpandGroup(row.group, row.groupVal)"
              >
                <td :class="[css.td]" class="!p-2" :colspan="colspan">
                  <div class="flex items-center gap-2">
                    <ExpandButton
                      :expanded="isExpandedGroup(row.group)"
                      @click="onToggleExpandGroup(row.group, row.groupVal)"
                    />
                    <slot
                      name="group.header.content"
                      :row="row"
                      :group="row.group"
                      :group-key="groupKey"
                      :group-value="row.groupVal"
                    >
                      <span>{{ groupKey }}: {{ row.groupVal }}</span>
                      <Button
                        size="sm"
                        variant="text"
                        icon
                        @click="
                          onCopyGroup({ key: groupKey, value: row.group })
                        "
                      >
                        <Icon name="file-copy-line" size="16" />
                      </Button>
                    </slot>
                    <Tooltip
                      :popper="{ placement: 'top' }"
                      class="ml-auto mr-2"
                    >
                      <template #activator>
                        <Button
                          size="sm"
                          variant="text"
                          icon
                          @click="onUngroup()"
                        >
                          <Icon name="delete-bin-line" size="14" />
                        </Button>
                      </template>
                      Ungroup
                    </Tooltip>
                  </div>
                </td>
              </slot>
            </tr>
            <template v-else>
              <tr
                :key="`row-${index}`"
                :class="[
                  css.tr,
                  { [css.tr__selected]: isSelected(row[rowAttr]) },
                ]"
                :hidden="isHiddenRow(row)"
              >
                <td v-if="selectedData" :class="css.checkbox">
                  <Checkbox
                    :data-cy="`table-toggle-check-${index}`"
                    :value="isSelected(row[rowAttr])"
                    color="primary"
                    hide-details
                    @input="onSelect($event, row[rowAttr])"
                  />
                </td>

                <td
                  v-for="(column, subIndex) in columns"
                  :key="subIndex"
                  :class="[
                    css.td,
                    column.cellClass,
                    css[`align__${column.align ?? 'start'}`],
                  ]"
                >
                  <slot
                    v-if="column.key === 'expand'"
                    :name="`item.${column.key}`"
                    :column="column"
                    :row="row"
                    :index="index"
                  >
                    <ExpandButton
                      v-if="!slots['item.expand']"
                      :expanded="isExpanded(row[rowAttr])"
                      @click="onToggleExpand(row)"
                    />
                  </slot>
                  <slot
                    v-else
                    :column="column"
                    :index="index"
                    :name="`item.${column.key.toString()}`"
                    :row="row"
                  >
                    {{ row[column.key] }}
                  </slot>
                </td>
              </tr>

              <tr
                v-if="expandable"
                :key="`row-expand-${index}`"
                :hidden="!isExpanded(row[rowAttr])"
                :class="[css.tr, css.tr__expandable]"
              >
                <td :colspan="colspan" :class="[css.td]">
                  <slot name="expanded-item" :row="row" :index="index" />
                </td>
              </tr>
            </template>
          </template>
          <tr
            v-if="noData && empty && !loading"
            :class="[css.tr, css.tr__empty]"
          >
            <Transition
              appear
              enter-active-class="transition ease-out duration-200 delay-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <td :class="css.td" :colspan="colspan">
                <slot name="no-data">
                  <div :class="css.empty">
                    <p v-if="empty.label" :class="css.empty__label">
                      {{ empty.label }}
                    </p>

                    <slot name="empty-description">
                      <p
                        v-if="empty.description"
                        :class="css.empty__description"
                      >
                        {{ empty.description }}
                      </p>
                    </slot>
                  </div>
                </slot>
              </td>
            </Transition>
          </tr>
          <slot
            v-if="slots['body.append'] && !(loading && noData)"
            :colspan="colspan"
            name="body.append"
          />
        </tbody>
        <tfoot>
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>
    <TablePagination
      v-if="paginationData && !hideDefaultFooter"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      data-cy="table-pagination"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative divide-y divide-black/[0.12] overflow-hidden;
  &.outlined {
    @apply border border-black/[0.12];
  }

  &.rounded__sm {
    @apply rounded-[.25rem];

    .image {
      @apply rounded-t-[.25rem];
    }
  }

  &.rounded__md {
    @apply rounded-[.75rem];

    .image {
      @apply rounded-t-[.75rem];
    }
  }

  &.rounded__lg {
    @apply rounded-[1rem];

    .image {
      @apply rounded-t-[1rem];
    }
  }

  .scroller {
    @apply overflow-x-auto overflow-y-hidden;
    clip-path: inset(0 0 0 0);
  }

  .table {
    @apply min-w-full table-fixed divide-y divide-black/[0.12] whitespace-nowrap mx-auto my-0 max-w-fit relative;

    .tbody {
      @apply divide-y divide-black/[0.12];

      &--striped {
        > .tr {
          &:nth-child(even) {
            @apply bg-rui-grey-50;
          }
        }
      }

      > .tr {
        @apply hover:bg-black/[0.04];

        &__selected {
          @apply bg-rui-primary/[0.08];
        }

        &__empty {
          @apply hover:bg-transparent;
        }

        &__expandable {
          @apply bg-[#f9fafb] hover:bg-[#f9fafb];
        }

        &__group {
          @apply bg-black/[0.02];
        }

        .td {
          @apply p-4 text-rui-text text-body-2;
          text-wrap: initial;

          &.align__start {
            @apply text-left rtl:text-right;
          }

          &.align__center {
            @apply text-center;
          }

          &.align__end {
            @apply text-right rtl:text-left;
          }

          .empty {
            @apply flex flex-col space-y-3 items-center justify-center flex-1 py-2;

            &__label {
              @apply text-body-1 font-bold text-center text-current pb-0 mb-0;
            }

            &__description {
              @apply text-body-2 text-center text-rui-text-secondary pb-0 mb-0;
            }
          }
        }
      }
    }

    .checkbox {
      @apply ps-4 w-14;
    }

    &.dense {
      .thead {
        .tr {
          .th {
            @apply py-[0.38rem];
          }
        }
      }

      .tbody {
        .td {
          @apply py-[0.38rem];
        }
      }
    }
  }
}

:global(.dark) {
  .wrapper {
    @apply divide-white/[0.12];

    &.outlined {
      @apply border-white/[0.12];
    }

    .table {
      @apply divide-white/[0.12];

      .tbody {
        @apply divide-white/[0.12];

        &--striped {
          > .tr {
            &:nth-child(even) {
              @apply bg-rui-grey-900;
            }
          }
        }

        > .tr {
          @apply hover:bg-white/[0.04];

          &__selected {
            @apply bg-rui-dark-primary/[0.08];
          }

          &__expandable {
            @apply bg-[#121212] hover:bg-[#121212];
          }

          &__group {
            @apply bg-white/[0.02];
          }
        }
      }
    }
  }
}
</style>
