<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import SimpleSelect from '@/components/forms/select/SimpleSelect.vue';

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface Props {
  value: TablePaginationData;
  dense?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'input', value: TablePaginationData): void;
}>();

const { value } = toRefs(props);

const css = useCssModule();

const defaultLimits = ref([5, 10, 15, 25, 50, 100]);

const limits = computed(() => get(value).limits ?? get(defaultLimits));

const currentLimit = computed({
  get: () => get(value).limit,
  set: (v) =>
    emit('input', {
      ...get(value),
      limit: Number(v),
      page: 1,
    }),
});

const pages = computed(() => {
  const { limit, total } = get(value);
  if (!total) {
    return 0;
  }
  return Math.ceil(total / limit);
});

const indicatorText = computed(() => {
  const { limit, total, page } = get(value);

  return `${formatInteger((page - 1) * limit + 1)}-${formatInteger(
    Math.min(page * limit, total),
  )} of ${formatInteger(total)}`;
});

const hasPrev = computed(() => get(value).page > 1);
const hasNext = computed(() => get(pages) > get(value).page);

const goToPage = (page: number) => {
  emit('input', {
    ...get(value),
    page,
  });
};

const onNavigate = (delta: number) => {
  goToPage(get(value).page + delta);
};

const onPrev = () => {
  if (!get(hasPrev)) {
    return;
  }
  onNavigate(-1);
};

const onNext = () => {
  if (!get(hasNext)) {
    return;
  }
  onNavigate(1);
};

const onFirst = () => {
  if (!get(hasPrev)) {
    return;
  }
  goToPage(1);
};

const onLast = () => {
  if (!get(hasNext)) {
    return;
  }
  goToPage(get(pages));
};
</script>

<template>
  <div :class="css.wrapper">
    <div :class="css.limit">
      <span :class="css.limit__text">Rows per page:</span>
      <SimpleSelect
        v-model="currentLimit"
        :options="limits"
        :disabled="loading"
        name="limit"
      />
    </div>
    <span :class="css.indicator">
      {{ indicatorText }}
    </span>
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
  @apply relative flex flex-wrap items-center justify-end space-x-6;

  .limit {
    @apply flex items-center space-x-2 text-caption;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-4;
    }
  }

  .indicator {
    @apply text-rui-text text-caption;
  }
  .navigation {
    @apply flex items-center;
  }
}
</style>
