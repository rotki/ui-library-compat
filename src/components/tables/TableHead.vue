<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';
import Icon from '@/components/icons/Icon.vue';
import Badge from '@/components/overlays/badge/Badge.vue';
import Progress from '@/components/progress/Progress.vue';

export type TableRow = any;

export type TableRowKey = keyof TableRow;

export interface TableColumn {
  key: TableRowKey;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  align?: 'start' | 'center' | 'end';
  class?: string;
  cellClass?: string;
  colspan?: string | number;
  rowspan?: string | number;
  [key: string]: any;
}

export interface SortColumn {
  column?: TableRowKey;
  direction: 'asc' | 'desc';
}

export type TableSortData = SortColumn | SortColumn[] | undefined;

export interface Props {
  loading?: boolean;
  stickyHeader?: boolean;
  stick?: boolean;
  selectable?: boolean;
  disableCheckAll?: boolean;
  noData?: boolean;
  dense?: boolean;
  colspan?: number;
  columns: TableColumn[];
  capitalizeHeaders?: boolean;
  isAllSelected?: boolean;
  indeterminate?: boolean;
  sortedMap: Record<TableRowKey, any>;
  sortData?: TableSortData;
  columnAttr: keyof TableColumn;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stickyHeader: false,
  stick: false,
  selectable: false,
  disableCheckAll: false,
  noData: false,
  dense: false,
  colspan: 0,
  columns: undefined,
  capitalizeHeaders: false,
  isAllSelected: false,
  indeterminate: false,
  sortedMap: () => ({}),
  columnAttr: 'label',
  sortData: undefined,
});

const emit = defineEmits<{
  (e: 'select:all', value: boolean): void;
  (e: 'sort', value: TableColumn): void;
}>();

const css = useCssModule();
const { sortedMap, sortData } = toRefs(props);

const onSort = (column: any) => emit('sort', column);

const onToggleAll = (checked: boolean) => emit('select:all', checked);

const isSortedBy = (key: TableRowKey) => key in get(sortedMap);

function getSortIndex(key: TableRowKey) {
  const sortBy = get(sortData);

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key))
    return -1;

  return sortBy.findIndex(sort => sort.column === key) ?? -1;
}
</script>

<template>
  <thead
    data-id="head-main"
    :class="[
      css.thead,
      {
        [css.sticky__header]: stickyHeader,
        [css.stick__top]: stick,
        [css.dense]: dense,
      },
    ]"
  >
    <tr :class="css.tr">
      <th
        v-if="selectable"
        :class="css.checkbox"
        scope="col"
        colspan="1"
        rowspan="1"
      >
        <Checkbox
          :disabled="disableCheckAll"
          :indeterminate="indeterminate"
          :value="isAllSelected"
          :size="dense ? 'sm' : undefined"
          color="primary"
          data-cy="table-toggle-check-all"
          hide-details
          @input="onToggleAll($event)"
        />
      </th>

      <th
        v-for="(column, index) in columns"
        :key="index"
        :class="[
          css.th,
          column.class,
          css[`align__${column.align ?? 'start'}`],
          {
            capitalize: !capitalizeHeaders,
            [css.sortable]: column.sortable,
          },
        ]"
        scope="col"
        :colspan="column.colspan ?? 1"
        :rowspan="column.rowspan ?? 1"
      >
        <slot
          :column="column"
          :name="`header.${column.key.toString()}`"
        >
          <Badge
            v-if="column.sortable"
            :value="getSortIndex(column.key) >= 0"
            :text="`${getSortIndex(column.key) + 1}`"
            :offset-y="dense ? 8 : 0"
            color="secondary"
            size="sm"
          >
            <Button
              :class="[
                css.sort__button,
                {
                  [css.sort__active]: isSortedBy(column.key),
                  [css[`sort__${sortedMap[column.key]?.direction}`]]:
                    isSortedBy(column.key),
                },
              ]"
              size="sm"
              variant="text"
              @click="onSort(column)"
            >
              <span :class="css.column__text">
                <slot
                  :name="`header.text.${column.key.toString()}`"
                  :column="column"
                >
                  {{ column[columnAttr] }}
                </slot>
              </span>

              <template
                v-if="column.align === 'end'"
                #prepend
              >
                <Icon
                  :class="css.sort__icon"
                  name="arrow-down-line"
                  size="18"
                />
              </template>

              <template #append>
                <Icon
                  v-if="column.align !== 'end'"
                  :class="css.sort__icon"
                  name="arrow-down-line"
                  size="18"
                />
              </template>
            </Button>
          </Badge>
          <span
            v-else
            :class="css.column__text"
          >
            <slot
              :name="`header.text.${column.key.toString()}`"
              :column="column"
            >
              {{ column[columnAttr] }}
            </slot>
          </span>
        </slot>
      </th>
    </tr>
    <tr
      v-if="loading && !noData"
      :class="[css.thead__loader, css.thead__loader_linear]"
    >
      <th
        :class="css.progress"
        :colspan="colspan"
        scope="col"
      >
        <div :class="css.progress__wrapper">
          <Progress
            color="primary"
            variant="indeterminate"
          />
        </div>
      </th>
    </tr>
  </thead>
</template>

<style module lang="scss">
.thead {
  @apply divide-y divide-black/[0.12];

  &.sticky__header {
    @apply top-0 z-10 absolute;

    &.stick__top {
      @apply fixed;

      tr {
        th {
          @apply bg-white border-b border-b-black/[0.12];
        }
      }
    }
  }

  &.dense {
    .tr {
      .th {
        @apply py-[0.38rem];
      }
    }
  }

  .tr {
    .th {
      @apply p-4;

      &.align__start {
        @apply text-left rtl:text-right;
      }

      &.align__center {
        @apply text-center;
      }

      &.align__end {
        @apply text-right rtl:text-left;
      }

      &.sortable {
        &.align__start {
          @apply pl-3;
        }

        &.align__center {
          @apply px-3;
          .sort__button {
            @apply ml-6;
          }
        }

        &.align__end {
          @apply pr-3;
        }

        .sort__button {
          @apply inline-flex;

          &:hover .sort__icon {
            @apply opacity-60;
          }

          &.sort {
            &__active {
              .sort__icon {
                @apply opacity-100;
              }
            }

            &__desc {
              .sort__icon {
                @apply rotate-0;
              }
            }

            &__asc {
              .sort__icon {
                @apply rotate-180;
              }
            }
          }
        }

        .sort__icon {
          @apply transition opacity-0 rotate-180;
        }
      }

      .column__text {
        @apply text-rui-text font-medium text-sm leading-6;
      }
    }

    .checkbox {
      @apply px-2 w-[3.625rem] max-w-[3.625rem];
      label {
        @apply ml-0;
      }
    }
  }

  &__loader {
    .progress {
      @apply relative py-8;
    }

    &_linear {
      @apply border-none;

      .progress {
        @apply p-0 h-0;
      }

      .progress__wrapper {
        @apply h-0 -mt-1;
      }
    }
  }
}

:global(.dark) {
  .thead {
    @apply divide-y divide-white/[0.12];

    &.sticky__header.stick__top {
      th {
        @apply bg-[#121212] border-b border-b-white/[0.12];
      }
    }

    .tr {
      .th {
        @apply text-white;
      }
    }
  }
}
</style>
