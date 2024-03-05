import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Accordions from '@/components/accordions/accordions/Accordions.vue';
import Accordion from '@/components/accordions/accordion/Accordion.vue';

function createWrapper(options?: any) {
  return mount(Accordions, {
    ...options,
    slots: {
      default: [
        `
          <Accordion>
            <template #header>Accordion 1 Header</template>
            Accordion 1 Content
          </Accordion>
        `,
        `
          <Accordion>
            <template #header>Accordion 2 Header</template>
            Accordion 2 Content
          </Accordion>
        `,
      ],
    },
    stubs: {
      Accordion,
    },
  });
}

describe('accordions/Accordions', () => {
  it('renders properly', async () => {
    const value = ref();
    const wrapper = createWrapper({
      listeners: {
        input: (e: any) => set(value, e),
      },
      propsData: {
        value,
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
  });

  it('works with multiple=`false`', async () => {
    const value = ref();
    const wrapper = createWrapper({
      listeners: {
        input: (e: any) => set(value, e),
      },
      propsData: {
        value,
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
    expect(get(value)).toBe(undefined);

    // Click first accordion
    await accordions.at(0).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toBe(0);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');

    // Click second accordion
    await accordions.at(1).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toBe(1);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 2 Content');

    // Click second accordion, it should be closed now
    await accordions.at(1).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toBe(-1);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
  });

  it('works with multiple=`true`', async () => {
    const value = ref();
    const wrapper = createWrapper({
      listeners: {
        input: (e: any) => set(value, e),
      },
      propsData: {
        multiple: true,
        value,
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
    expect(get(value)).toBe(undefined);

    // Click first accordion
    await accordions.at(0).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toStrictEqual([0]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');

    // Click second accordion, both should be opened
    await accordions.at(1).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toStrictEqual([0, 1]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(2);

    // Click second accordion, only close this accordion
    await accordions.at(1).find('.accordion__header').trigger('click');
    await nextTick();
    expect(get(value)).toStrictEqual([0]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');
  });
});
