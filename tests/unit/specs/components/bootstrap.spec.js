import {
    shallowMount,
    createLocalVue,
} from '@vue/test-utils';
import VueRouter from 'vue-router';

import SBootstrap from '@/components/bootstrap.vue';


describe('Component `bootstrap`', () => {
    it('should have correct name', () => {
        expect(SBootstrap.name).toBe('SBootstrap');
    });

    it('should have correct markup', () => {
        const localVue = createLocalVue();
        localVue.use(VueRouter);

        const wrapper = shallowMount(SBootstrap, {
          localVue
        });

        expect(wrapper.element).toMatchSnapshot();
    });
});
