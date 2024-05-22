import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import { TeleportPlugin } from '@/components/overlays/teleport-container';

interface SelectOption { id: string; label: string }

Vue.use(TeleportPlugin);

function createWrapper(options?: any) {
  return mount(RuiMenuSelect, options);
}

describe('menu select', () => {
  const options: SelectOption[] = [
    { id: '1', label: 'Germany' },
    { id: '2', label: 'Nigeria' },
    { id: '3', label: 'Greece' },
    { id: '4', label: 'Indonesia' },
    { id: '5', label: 'Spain' },
    { id: '6', label: 'India' },
    { id: '7', label: 'France' },
    { id: '8', label: 'England' },
    ...[...new Array(50).keys()].map(index => ({
      id: `${index + 9}`,
      label: `${index + 9}`,
    })),
  ];

  it('renders properly', () => {
    const wrapper = createWrapper({
      propsData: {
        keyAttr: 'id',
        options,
        textAttr: 'label',
        value: null,
      },
    });

    expect(wrapper.get('button[data-id="activator"]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_activator_/)]),
    );
    expect(wrapper.find('button[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      propsData: {
        disabled: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
        value: options[4].id,
      },
    });
    expect(wrapper.find('button[aria-disabled]').exists()).toBeTruthy();
    expect(wrapper.find('button[aria-disabled]').text()).toMatch('Spain');
  });

  it('works with primitive options', () => {
    const wrapper = createWrapper({
      propsData: {
        options: options.map(item => item.label),
        value: options[4].label,
      },
    });
    expect(wrapper.find('button[data-id=activator]').text()).toMatch('Spain');
  });

  it('value passed and emitted properly', async () => {
    const wrapper = createWrapper({
      propsData: {
        autoSelectFirst: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
      },
    });

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = document.body.querySelector(`button:first-child`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    buttonToSelect?.click();
    expect(wrapper.emitted().input!.at(-1)![0]).toBe(selectedIndex.toString());

    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    await nextTick();

    highlightedItemButton = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.down');

    highlightedItemButton = document.body.querySelector(`button:nth-child(${selectedIndex + 1})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.up');
    await wrapper.find('[data-id=activator]').trigger('keydown.up');

    const newSelectedIndex = selectedIndex - 1;

    highlightedItemButton = document.body.querySelector(`button:nth-child(${newSelectedIndex})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    highlightedItemButton?.click();
    expect(wrapper.emitted().input!.at(-1)![0]).toBe(newSelectedIndex.toString());
  });
});
