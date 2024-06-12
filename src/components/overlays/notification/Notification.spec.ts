import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { TeleportPlugin } from '@/components/overlays/teleport-container';
import Notification from '@/components/overlays/notification/Notification.vue';

Vue.use(TeleportPlugin);

function createWrapper(options?: any) {
  return mount(Notification, {
    ...options,
    scopedSlots: {
      default: `<div id="content">Notification</div>`,
    },
    stubs: {
      Transition: true,
    },
  });
}

describe('notification', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      propsData: {
        timeout: 0,
        value: true,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    wrapper.destroy();
  });

  it('does not render if value is false', async () => {
    const wrapper = createWrapper({
      propsData: {
        timeout: 0,
        value: false,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeFalsy();
    wrapper.destroy();
  });

  it('closes on click', async () => {
    const wrapper = createWrapper({
      propsData: {
        timeout: 0,
        value: true,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toHaveProperty('input', [[false]]);
    wrapper.destroy();
  });

  it('does not close on click if timeout is negative', async () => {
    const wrapper = createWrapper({
      propsData: {
        timeout: -1,
        value: true,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toEqual({});
    wrapper.destroy();
  });

  it('closes automatically after timeout', async () => {
    vi.useFakeTimers();
    const wrapper = createWrapper({
      propsData: {
        timeout: 5000,
        value: true,
      },
    });

    await nextTick();
    vi.advanceTimersByTime(3000);
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    expect(wrapper.emitted()).toEqual({});
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted()).toHaveProperty('input', [[false]]);
    wrapper.destroy();
    vi.useRealTimers();
  });
});
