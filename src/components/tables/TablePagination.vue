<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface Props {
  value: TablePaginationData;
  dense?: boolean;
  disablePerPage?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  loading: false,
  disablePerPage: false,
});

const emit = defineEmits<{
  (e: 'input', value: TablePaginationData): void;
}>();

const { value } = toRefs(props);

const css = useCssModule();

const tableDefaults = useTable();

const limits = computed(
  () => (get(value).limits ?? get(tableDefaults.limits)).map(limit => ({ limit })),
);

const currentLimit = computed({
  get: () => get(value).limit,
  set: limit =>
    emit('input', {
      ...get(value),
      limit: Number(limit),
      page: 1,
    }),
});

const pages = computed(() => {
  const { limit, total } = get(value);
  if (!total)
    return 0;

  return Math.ceil(total / limit);
});

const ranges = computed(() => {
  const segments = [];

  for (let page = 1; page <= get(pages); page++)
    segments.push({ page, text: pageRangeText(page) });

  return segments;
});

const indicatorText = computed(() => {
  const { total } = get(value);
  return `${!total ? '0 ' : ''}of ${formatInteger(total)}`;
});

const currentRange = computed({
  get: () => get(value).page,
  set: page =>
    emit('input', {
      ...get(value),
      page,
    }),
});

const hasPrev = computed(() => get(value).page > 1);
const hasNext = computed(() => get(pages) > get(value).page);

function goToPage(page: number) {
  emit('input', {
    ...get(value),
    page,
  });
}

function pageRangeText(page: number) {
  const { limit, total } = get(value);
  return `${formatInteger((page - 1) * limit + 1)} - ${formatInteger(
    Math.min(page * limit, total),
  )}`;
}

function onNavigate(delta: number) {
  goToPage(get(value).page + delta);
}

function onPrev() {
  if (!get(hasPrev))
    return;

  onNavigate(-1);
}

function onNext() {
  if (!get(hasNext))
    return;

  onNavigate(1);
}

function onFirst() {
  if (!get(hasPrev))
    return;

  goToPage(1);
}

function onLast() {
  if (!get(hasNext))
    return;

  goToPage(get(pages));
}
</script>

<template>
  <div :class="css.wrapper">
    <div :class="css.limit">
      <span :class="css.limit__text">Rows per page:</span>
      <RuiMenuSelect
        v-model="currentLimit"
        :options="limits"
        :disabled="loading || disablePerPage"
        label-class="!text-xs !min-h-8"
        name="limit"
        key-attr="limit"
        text-attr="limit"
        hide-details
        dense
      />
    </div>
    <div :class="css.ranges">
      <span :class="css.ranges__text">Items #</span>
      <RuiMenuSelect
        v-if="ranges.length > 0"
        v-model="currentRange"
        :options="ranges"
        :disabled="loading"
        label-class="!text-xs !min-h-8"
        name="ranges"
        key-attr="page"
        text-attr="text"
        hide-details
        dense
      />
      <span :class="css.indicator">
        {{ indicatorText }}
      </span>
    </div>
    <div :class="css.navigation">
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev"
        variant="text"
        icon
        @click="onFirst()"
      >
        <Icon name="arrow-left-double-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev"
        variant="text"
        icon
        @click="onPrev()"
      >
        <Icon name="arrow-left-s-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext"
        variant="text"
        icon
        @click="onNext()"
      >
        <Icon name="arrow-right-s-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext"
        variant="text"
        icon
        @click="onLast()"
      >
        <Icon name="arrow-right-double-line" />
      </Button>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative flex flex-wrap items-center justify-end;

  .limit {
    @apply flex items-center space-x-2 text-caption px-3;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-4;
    }
  }

  .ranges {
    @apply flex items-center space-x-2 text-caption px-3;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-4;
    }
  }

  .indicator {
    @apply text-rui-text text-caption whitespace-nowrap;
  }

  .navigation {
    @apply flex items-center pl-3;
  }
}
</style>
