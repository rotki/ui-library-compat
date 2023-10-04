import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/buttons/button/Button.vue';
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';

const createWrapper = (options?: any) =>
  mount(Tooltip, {
    ...options,
    slots: {
      activator: { template: '<rui-button>Tooltip trigger</rui-button>' },
      default: options?.props?.text ?? '',
    },
    stubs: { RuiButton: Button },
  });

const delay = (time: number = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

describe('Tooltip', () => {
  const text = 'Tooltip content';

  it('renders properly', async () => {
    const wrapper = createWrapper({
      propsData: {
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.destroy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      propsData: {
        text,
        disabled: true,
      },
    });
    expect(wrapper.get('div[class*=_activator_]')).toBeTruthy();
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();
    wrapper.destroy();
  });

  it('disabled does not trigger tooltip', async () => {
    const wrapper = createWrapper({
      propsData: {
        text,
        disabled: true,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');
    await delay();

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.destroy();
  });

  it('tooltip only appears after `openDelay` timeout', async () => {
    const wrapper = createWrapper({
      propsData: {
        text,
        openDelay: 400,
        closeDelay: 50000,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    // Tooltip shouldn't appear if the mouseleave happens before the timer ends.
    await delay(100);
    await wrapper.trigger('mouseleave');
    await delay(500);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await delay(350);
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    wrapper.destroy();
  });

  it('tooltip disappears after `closeDelay` timeout', async () => {
    const wrapper = createWrapper({
      propsData: {
        text,
        closeDelay: 1000,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    await wrapper.trigger('mouseleave');

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    await delay(2100);

    tooltip = document.body.querySelector('div[role=tooltip]');
    expect(tooltip).toBeFalsy();

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeFalsy();

    await wrapper.setProps({ disabled: true });

    tooltip = document.body.querySelector('div[role=tooltip]');
    expect(tooltip).toBeFalsy();
    wrapper.destroy();
  });
});
