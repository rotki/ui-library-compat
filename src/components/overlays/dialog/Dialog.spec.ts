import { describe, expect, it, vi } from 'vitest';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { TeleportPlugin } from '@/components/overlays/teleport-container';
import Dialog from '@/components/overlays/dialog/Dialog.vue';
import Button from '@/components/buttons/button/Button.vue';

const text = 'This is content';

Vue.use(TeleportPlugin);

function createWrapper(options?: any) {
  return mount(Dialog, {
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
    let dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeFalsy();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeTruthy();
    expect(dialog.querySelector('div[class*=_content_]')).toBeTruthy();
    expect(dialog.querySelector('div[class*=_center_]')).toBeTruthy();

    // Click the button that call close function
    const closeButton = dialog.querySelector('#close') as HTMLButtonElement;
    closeButton.click();

    await vi.delay();
    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeFalsy();
    wrapper.destroy();
  });

  it('should pass width and maxWidth props', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    const dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(dialog).toBeTruthy();

    const contentWrapper = dialog.querySelector('div[class*=_content_]') as HTMLDivElement;
    expect(contentWrapper).toBeTruthy();

    expect(contentWrapper.style.width).toBe('98%');
    expect(contentWrapper.style.maxWidth).toBeFalsy();

    await wrapper.setProps({
      maxWidth: '100%',
      width: '500',
    });

    expect(contentWrapper.style.width).toBe('500px');
    expect(contentWrapper.style.maxWidth).toBe('100%');

    wrapper.destroy();
  });

  it('dialog works with `persistent=false`', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    let dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(dialog).toBeTruthy();

    // Click on the overlay should close the dialog
    const overlay = dialog.querySelector('div[class*=_overlay_]') as HTMLDivElement;
    overlay.click();

    await vi.delay();
    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeFalsy();

    await vi.delay();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(dialog).toBeTruthy();

    // Press escape should also close the dialog
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.dispatchEvent(event);

    await vi.delay();
    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeFalsy();

    wrapper.destroy();
  });

  it('dialog works with `persistent=true`', async () => {
    const wrapper = createWrapper({
      propsData: {
        persistent: true,
      },
    });
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    let dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(dialog).toBeTruthy();

    // Click on the overlay should not close the dialog
    const overlay = dialog.querySelector('div[class*=_overlay_]') as HTMLDivElement;
    overlay.click();

    await vi.delay();
    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeTruthy();

    // Press escape should not close the dialog
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.dispatchEvent(event);

    await vi.delay();
    dialog = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(dialog).toBeTruthy();

    wrapper.destroy();
  });
});
