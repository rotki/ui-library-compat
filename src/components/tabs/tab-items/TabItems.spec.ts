import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TabItems from '@/components/tabs/tab-items/TabItems.vue';
import TabItem from '@/components/tabs/tab-item/TabItem.vue';

const createWrapper = (options?: any) =>
  mount(TabItems, {
    ...options,
    stubs: {
      TabItem,
      Transition: {
        template: `<span><slot></slot></span>`,
      },
    },
    slots: {
      default: [
        `<TabItem>Tab Content 1</TabItem>`,
        `<TabItem>Tab Content 2</TabItem>`,
        `<TabItem>Tab Content 3</TabItem>`,
        `<TabItem>Tab Content 4</TabItem>`,
      ],
    },
  });

describe('Tabs/TabItems', () => {
  it('renders properly', async () => {
    const value = ref(0);
    const wrapper = createWrapper({
      propsData: {
        value,
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('Tab Content 1');

    set(value, 1);
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('Tab Content 2');
  });
});
