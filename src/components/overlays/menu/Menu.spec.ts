import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Button from '@/components/buttons/button/Button.vue';
import Menu from '@/components/overlays/menu/Menu.vue';
import { TeleportPlugin } from '@/components/overlays/teleport-container';

const text = 'This is menu';

function createWrapper(options?: any) {
  Vue.use(TeleportPlugin);
  return mount(Menu, {
    ...options,
    scopedSlots: {
      activator: `<rui-button id="trigger" v-on="props.on">
        Click me!
      </rui-button>`,
    },
    slots: {
      default: `<div class="py-2 px-3">${text}</div>`,
    },
    stubs: { RuiButton: Button },
  });
}

function delay(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

describe('menu', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    // Click the content shouldn't close the menu
    menu.click();
    await delay();

    menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    // Click outside should close the menu
    document.body.click();
    await delay();

    menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeFalsy();

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    wrapper.destroy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      propsData: {
        disabled: true,
      },
    });
    expect(wrapper.get('#trigger')).toBeTruthy();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();
    wrapper.destroy();
  });

  it('disabled does not trigger menu', async () => {
    const wrapper = createWrapper({
      propsData: {
        disabled: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    wrapper.destroy();
  });

  it('menu only appears after `openDelay` timeout', async () => {
    const wrapper = createWrapper({
      propsData: {
        closeDelay: 50000,
        openDelay: 400,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    const menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    await delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    await delay(500);
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    wrapper.destroy();
  });

  it('menu disappears after `closeDelay` timeout', async () => {
    const wrapper = createWrapper({
      propsData: {
        closeDelay: 1000,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    await wrapper.find('#trigger').trigger('click');

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    await delay(2100);

    menu = document.body.querySelector('div[role=menu]');
    expect(menu).toBeFalsy();

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();

    await wrapper.setProps({ disabled: true });

    menu = document.body.querySelector('div[role=menu]');
    expect(menu).toBeFalsy();
    wrapper.destroy();
  });

  describe('menu works with `openOnHover=true`', () => {
    it('hover without click', async () => {
      const wrapper = createWrapper({
        propsData: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();

      await wrapper.find('#trigger').trigger('mouseleave');

      menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();

      await delay(2100);

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeFalsy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeFalsy();
    });

    it('hover with click', async () => {
      const wrapper = createWrapper({
        propsData: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();

      await wrapper.find('#trigger').trigger('click');
      await delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();

      await wrapper.find('#trigger').trigger('mouseleave');
      await delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();

      await wrapper.find('#trigger').trigger('click');
      await delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeFalsy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeFalsy();
    });
  });

  it('menu works with `closeOnContentClick=true`', async () => {
    const wrapper = createWrapper({
      propsData: {
        closeOnContentClick: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    // Click the content should close the menu
    menu.click();
    await delay();

    menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeFalsy();

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
  });
});
