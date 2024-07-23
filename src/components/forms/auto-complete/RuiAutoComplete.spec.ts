import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import AutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import { TeleportPlugin } from '@/components/overlays/teleport-container';

interface SelectOption { id: string; label: string }

Vue.use(TeleportPlugin);

function createWrapper(options?: any) {
  return mount(AutoComplete, options);
}

describe('autocomplete', () => {
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

    expect(wrapper.get('div[data-id="activator"]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_activator_/)]),
    );
    expect(wrapper.find('div[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
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
    expect(wrapper.find('div[data-id=activator][tabindex=-1]').exists()).toBeTruthy();
    expect((wrapper.find('div[data-id=activator][tabindex=-1] input').element as HTMLInputElement).value).toMatch('Spain');
  });

  it('works with primitive options', () => {
    const wrapper = createWrapper({
      propsData: {
        options: options.map(item => item.label),
        value: options[4].label,
      },
    });
    expect((wrapper.find('div[data-id=activator] input').element as HTMLInputElement).value).toMatch('Spain');
  });

  it('value passed and emitted properly', async () => {
    const wrapper = createWrapper({
      attachTo: document.body,
      propsData: {
        autoSelectFirst: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
      },
    });

    await wrapper.find('input').trigger('focus');
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('focus');
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    // Close Menu Select
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.delay();
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select by Enter
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.delay();
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = document.body.querySelector(`button:first-child`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    buttonToSelect?.click();
    expect(wrapper.emitted().input!.at(-1)![0]).toBe(selectedIndex.toString());

    await wrapper.setProps({
      value: selectedIndex.toString(),
    });

    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Shouldn't open menu select because the value has been set
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

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

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    const newSelectedIndexToString = newSelectedIndex.toString();
    expect(wrapper.emitted().input!.at(-1)![0]).toBe(newSelectedIndexToString);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Delete option should also remove selected value with that option
    const newOptions = options.filter(item => item.id !== newSelectedIndexToString);

    await wrapper.setProps({
      options: newOptions,
      value: newSelectedIndexToString,
    });
    await nextTick();

    // Even if the options changed, the search value should not be touch as long as the focus still there, so the UX is not breaking
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Still not supposed to change the search value
    const menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;
    menu.focus();
    await nextTick();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Only after nothing is focused anymore, the search value can be reset
    menu.blur();
    (wrapper.find('input').element as HTMLInputElement).blur();
    await nextTick();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');

    // doesn't break when use chips
    await wrapper.setProps({
      chips: true,
    });
  });

  it('multiple value', async () => {
    const wrapper = createWrapper({
      propsData: {
        autoSelectFirst: true,
        chips: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
        value: ['7', '8'],
      },
    });

    expect(wrapper.find('div[data-id=activator]').exists()).toBeTruthy();
    let chips = wrapper.find('div[data-id=activator]').findAll('.rui-chip');
    expect(chips).toHaveLength(2);
    expect(chips.at(0).text()).toBe('France');
    expect(chips.at(1).text()).toBe('England');

    // Add India
    await wrapper.find('input').setValue('India');
    await vi.delay();

    expect(document.body.querySelectorAll('button').length).toBe(1);
    const itemButton = document.body.querySelector('button')!;
    expect(itemButton.innerHTML).toContain('India');
    itemButton.click();

    await nextTick();
    const input = wrapper.find('div[data-id=activator] input').element as HTMLInputElement;
    expect(input.value).toMatch('');
    expect(input.classList).toContain('h-0');

    let newValue = ['7', '8', '6'];
    expect(wrapper.emitted().input!.at(-1)![0]).toEqual(newValue);

    await wrapper.setProps({
      value: newValue,
    });

    chips = wrapper.find('div[data-id=activator]').findAll('.rui-chip');
    expect(chips).toHaveLength(3);

    expect(chips.at(0).text()).toBe('France');
    expect(chips.at(1).text()).toBe('England');
    expect(chips.at(2).text()).toBe('India');

    // Delete England
    await chips.at(0).find('button[type="button"]').trigger('click');
    await nextTick();

    newValue = ['8', '6'];
    expect(wrapper.emitted().input!.at(-1)![0]).toEqual(newValue);

    // Delete option should also remove selected value with that option
    await wrapper.setProps({
      value: newValue,
    });
    const newOptions = options.filter(item => item.id !== '8');

    await wrapper.setProps({
      options: newOptions,
    });
    await nextTick();

    newValue = ['6'];
    expect(wrapper.emitted().input!.at(-1)![0]).toEqual(newValue);
  });

  it('custom value', async () => {
    const wrapper = createWrapper({
      propsData: {
        autoSelectFirst: true,
        chips: true,
        customValue: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
        value: ['custom value'],
      },
    });

    expect(wrapper.find('div[data-id=activator]').exists()).toBeTruthy();
    const chips = wrapper.find('div[data-id=activator]').findAll('.rui-chip');
    expect(chips).toHaveLength(1);
    expect(chips.at(0).text()).toBe('custom value');

    await wrapper.find('input').setValue('custom value 2');
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');

    expect(wrapper.emitted().input!.at(-1)![0]).toEqual([
      'custom value',
      'custom value 2',
    ]);
  });
});
