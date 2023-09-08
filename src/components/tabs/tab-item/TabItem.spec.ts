import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TabItem from '@/components/tabs/tab-item/TabItem.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof TabItem>) =>
  mount(TabItem, {
    ...options,
    propsData: {
      value: 'value',
      ...options?.propsData,
    },
    slots: {
      default: `<div>Tab Content</div>`,
    },
  });

describe('Tabs/TabItem', () => {
  it('do not render if not active', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('div>div').exists()).toBeFalsy();
  });

  it("render if it's active", async () => {
    const wrapper = createWrapper({
      propsData: {
        active: true,
      },
    });

    expect(wrapper.find('div>div').exists()).toBeTruthy();
    expect(wrapper.find('div>div').classes()).not.toMatch(/hidden/);

    await wrapper.setProps({
      eager: true,
    });
    expect(wrapper.find('div>div').exists()).toBeTruthy();
    expect(wrapper.find('div>div').classes()).not.toMatch(/hidden/);

    await wrapper.setProps({
      active: false,
    });

    expect(wrapper.find('div>div').exists()).toBeTruthy();
    expect(wrapper.find('div>div').classes()).toMatch(/hidden/);
  });
});
