import type { Ref } from 'vue';

export interface DropdownOptions<T, K> {
  options: Ref<T[]>;
  dense?: Ref<boolean>;
  value: Ref<T | T[] | undefined>;
  menuRef: Ref<HTMLElement>;
  keyAttr?: K;
  textAttr?: K | ((item: T) => string);
  appendWidth?: number;
  prependWidth?: number;
  itemHeight?: number;
  overscan?: number;
  autoSelectFirst?: boolean;
  autoFocus?: boolean;
  setValue?: (val: T) => void;
  hideSelected?: boolean;
}

export function useDropdownMenu<T, K extends keyof T>({
  appendWidth,
  autoFocus,
  autoSelectFirst,
  dense,
  hideSelected,
  itemHeight = 48,
  keyAttr,
  menuRef,
  options: allOptions,
  overscan = 5,
  prependWidth,
  setValue,
  textAttr,
  value,
}: DropdownOptions<T, K>) {
  const options = computed(() => {
    const options = get(allOptions);
    if (!hideSelected)
      return options;

    return options.filter(item => !isActiveItem(item));
  });

  const { containerProps, list, scrollTo, wrapperProps } = useVirtualList<T>(
    options,
    {
      itemHeight,
      overscan,
    },
  );

  const renderedData = useArrayMap(list, ({ data, index }) => ({ index, item: data }));

  const isOpen: Ref<boolean> = ref(false);

  const valueKey = computed(() => {
    const selected = get(value);
    if (!keyAttr || !selected)
      return selected;
    return Array.isArray(selected) ? selected.map(item => item[keyAttr]) : selected[keyAttr];
  });

  const highlightedIndex: Ref<number> = ref(get(autoSelectFirst) ? 0 : -1);

  const menuWidth = computed(() => {
    const widths = { max: 0, min: 0 };
    const maxWidth = 30;
    const paddingX = 1.5;
    const fontMultiplier = get(dense) ? 12 : 13;

    get(options).forEach((option) => {
      const length = getText(option)?.toString()?.length ?? 0;
      if (widths.min === 0 && widths.max === 0) {
        widths.min = length;
        widths.max = length;
      }
      else if (length < widths.min) {
        widths.min = length;
      }
      else if (length > widths.max) {
        widths.max = length;
      }
    });

    const difference = widths.max - widths.min;

    function computeValue(width: number) {
      const additionalWidths = (prependWidth ? prependWidth + 0.5 : 0) + (appendWidth ? appendWidth + 0.5 : 0);
      return `${Math.min((width * fontMultiplier) / 16 + paddingX + additionalWidths, maxWidth)}rem`;
    }

    if (difference <= 5)
      return computeValue(widths.max);

    return computeValue(widths.min + difference / 2);
  });

  function toggle(state: boolean = false) {
    set(isOpen, state);
  }

  function getText(item: T): T[K] | T | string {
    if (textAttr) {
      if (typeof textAttr === 'function')
        return textAttr(item);

      else
        return item[textAttr];
    }

    return item;
  }

  function getIdentifier(item: T): T[K] | T {
    if (keyAttr)
      return item[keyAttr];

    return item;
  }

  function itemIndexInValue(item: T): number {
    const val = get(value);
    const selected: T[] = Array.isArray(val) ? val : (val ? [val] : []);

    if (selected.length === 0)
      return -1;

    return selected.findIndex((selectedItem) => {
      if (keyAttr)
        return selectedItem[keyAttr] === item[keyAttr];
      return selectedItem === item;
    });
  }

  function isActiveItem(item: T): boolean {
    return itemIndexInValue(item) !== -1;
  }

  function adjustScrollByHighlightedIndex(smooth: boolean = false) {
    const index = get(highlightedIndex);
    if (index > -1) {
      nextTick(() => {
        const container = get(menuRef)?.parentElement;
        if (container) {
          const highlightedElem = get(menuRef).getElementsByClassName('highlighted')[0];

          if (highlightedElem) {
            highlightedElem.scrollIntoView?.({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
            if (get(autoFocus) && 'focus' in highlightedElem && typeof highlightedElem.focus === 'function')
              highlightedElem?.focus();
          }
          else {
            scrollTo(index);
            if (get(autoFocus)) {
              const elem = get(menuRef).getElementsByClassName('highlighted')[0];
              if (elem && 'focus' in elem && typeof elem.focus === 'function')
                elem.focus();
            }
          }
        }
      });
    }
  }

  function updateOpen(open: boolean) {
    nextTick(() => {
      if (open) {
        const val = get(value);

        // set highlighted index to active item
        if ((Array.isArray(val) && val.length > 0) || !!val) {
          const index = get(options).findIndex(isActiveItem);
          if (index > -1)
            set(highlightedIndex, index);
        }

        watchOnce(list, () => {
          adjustScrollByHighlightedIndex();
        });
      }
    });
  }

  watch(isOpen, updateOpen);

  watch(highlightedIndex, (curr, prev) => {
    if (curr !== prev) {
      nextTick(() => {
        adjustScrollByHighlightedIndex(true);
      });
    }
  });

  watch(options, () => {
    if (get(highlightedIndex) !== -1) {
      if (get(autoSelectFirst)) {
        set(highlightedIndex, 0);
        adjustScrollByHighlightedIndex();
      }
      else {
        set(highlightedIndex, -1);
        scrollTo(0);
      }
    }
    else {
      scrollTo(0);
    }
  });

  const moveHighlight = (up: boolean) => {
    if (get(!isOpen))
      return;

    let position = get(highlightedIndex);
    const move = up ? -1 : 1;

    position += move;

    const total = get(options).length;

    if (position >= total)
      set(highlightedIndex, 0);
    else if (position < 0)
      set(highlightedIndex, total - 1);
    else
      set(highlightedIndex, position);
  };

  const applyHighlighted = () => {
    if (!setValue || !get(isOpen))
      return;

    const highlightedIndexVal = get(highlightedIndex);
    if (highlightedIndexVal === -1)
      return;

    const entry = get(options).find((_data, index) => highlightedIndexVal === index);
    if (entry)
      setValue(entry);
  };

  return {
    applyHighlighted,
    containerProps,
    getIdentifier,
    getText,
    highlightedIndex,
    isActiveItem,
    isOpen,
    itemIndexInValue,
    menuWidth,
    moveHighlight,
    optionsWithSelectedHidden: options,
    renderedData,
    toggle,
    valueKey,
    wrapperProps,
  };
}
