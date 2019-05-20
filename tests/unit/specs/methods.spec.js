import Vue from 'vue';
import bootstrap from '@/index';


describe('Wrapping of Vue Global API', () => {
    it('should wrap method `component`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/assets.js
        const component = Vue.component;
        const spy = jest.fn();
        Vue.component = spy;

        const app = bootstrap();
        let ret;

        const someComponent = {
            render: h => h('div', 'content of some component'),
        };

        // setting of component
        ret = app.component('some-component', someComponent);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-component');
        expect(spy.mock.calls[0][1]).toBe(someComponent);
        expect(ret).toBe(app);

        spy.mockReset();

        // getting of component
        spy.mockReturnValue(someComponent);
        ret = app.component('some-component');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-component');
        expect(spy.mock.calls[0][1]).not.toBeDefined();
        expect(ret).toBe(someComponent);

        Vue.component = component;
    });

    it('should wrap method `directive`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/assets.js
        const directive = Vue.directive;
        const spy = jest.fn();
        Vue.directive = spy;

        const app = bootstrap();
        let ret;

        const someDirective = {
            bind() {},
        };

        // setting of directive
        ret = app.directive('some-directive', someDirective);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-directive');
        expect(spy.mock.calls[0][1]).toBe(someDirective);
        expect(ret).toBe(app);

        spy.mockReset();

        // getting directive
        spy.mockReturnValue(someDirective);
        ret = app.directive('some-directive');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-directive');
        expect(spy.mock.calls[0][1]).not.toBeDefined();
        expect(ret).toBe(someDirective);

        Vue.directive = directive;
    });

    it('should wrap method `filter`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/assets.js
        const filter = Vue.filter;
        const spy = jest.fn();
        Vue.filter = spy;

        const app = bootstrap();
        let ret;

        function someFilter() {}

        // setting of filter
        ret = app.filter('some-filter', someFilter);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-filter');
        expect(spy.mock.calls[0][1]).toBe(someFilter);
        expect(ret).toBe(app);

        spy.mockReset();

        // getting of filter
        spy.mockReturnValue(someFilter);
        ret = app.filter('some-filter');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('some-filter');
        expect(spy.mock.calls[0][1]).not.toBeDefined();
        expect(ret).toBe(someFilter);

        Vue.filter = filter;
    });

    it('should wrap method `mixin`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/mixin.js
        const mixin = Vue.mixin;
        const spy = jest.fn();
        Vue.mixin = spy;

        const app = bootstrap();
        let ret;

        const someMixin = {
            beforeCreate() {},
        };

        // setting of mixin
        ret = app.mixin(someMixin);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(someMixin);
        expect(ret).toBe(app);

        Vue.mixin = mixin;
    });

    it('should wrap method `use`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js
        const use = Vue.use;
        const spy = jest.fn();
        Vue.use = spy;

        const app = bootstrap();
        let ret;

        const somePlugin = {
            install() {},
        };

        // setting of plugin
        ret = app.use(somePlugin);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(somePlugin);
        expect(ret).toBe(app);

        Vue.use = use;
    });
});
