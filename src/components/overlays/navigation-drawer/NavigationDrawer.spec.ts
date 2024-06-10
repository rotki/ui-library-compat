import { describe, expect, it, vi } from 'vitest';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { TeleportPlugin } from '@/components/overlays/teleport-container';
import NavigationDrawer from '@/components/overlays/navigation-drawer/NavigationDrawer.vue';
import Button from '@/components/buttons/button/Button.vue';

const text = 'Navigation Drawer Content';

Vue.use(TeleportPlugin);

function createWrapper(options?: any) {
  return mount(NavigationDrawer, {
    ...options,
    scopedSlots: {
      activator: `<rui-button id="trigger" v-on="props.on">
        Click me!
      </rui-button>`,
      default: `
        <div>
          ${text}
          
          <rui-button id="close" @click="props.close()" />
        </div>
      `,
    },
    stubs: { RuiButton: Button },
  });
}

describe('dialog', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();
    await nextTick();
    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();

    // Open drawer by clicking activator
    await wrapper.find('#trigger').trigger('click');

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();

    // Click the button that call close function
    const closeButton = drawer.querySelector('#close') as HTMLButtonElement;
    closeButton.click();

    await nextTick();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();
    wrapper.destroy();
  });

  it('should pass width and position props', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    expect(drawer.style.width).toBe('360px');

    await wrapper.setProps({
      position: 'right',
      width: '500',
    });

    drawer = document.body.querySelector('aside[class*=_visible_][class*=_right_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();
    expect(drawer.style.width).toBe('500px');

    wrapper.destroy();
  });

  it('dialog works with `temporary=false`', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.delay();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();

    wrapper.destroy();
  });

  it('dialog works with `temporary=true`', async () => {
    const wrapper = createWrapper({
      propsData: {
        temporary: true,
      },
    });
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.delay();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();

    wrapper.destroy();
  });
});
