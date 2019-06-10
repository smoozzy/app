import Vue from 'vue';
import bootstrap, {
    mapState,
    mapActions,
} from '@/index';

// Remove devtools notification
Vue.config.devtools = false;


describe('Wrapping of Vue Global API', () => {
    let app;

    beforeEach(() => {
        app = bootstrap();
    });

    afterEach(() => {
        app.$destroy();
    });

    it('should wrap method `component`', () => {
        // @see https://github.com/vuejs/vue/blob/dev/src/core/global-api/assets.js
        const component = Vue.component;
        const spy = jest.fn();
        Vue.component = spy;

        const someComponent = {
            render: h => h('div', 'content of some component'),
        };
        let ret;

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

        const someDirective = {
            bind() {},
        };
        let ret;

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

        function someFilter() {}
        let ret;

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

        const someMixin = {
            beforeCreate() {},
        };

        // setting of mixin
        const ret = app.mixin(someMixin);

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

        const somePlugin = {
            install() {},
        };

        // setting of plugin
        const ret = app.use(somePlugin);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(somePlugin);
        expect(ret).toBe(app);

        Vue.use = use;
    });
});

describe('Application modules', () => {
    let app;

    beforeEach(() => {
        app = bootstrap();
    });

    afterEach(() => {
        app.$destroy();
    });

    it('should register application module', done => {
        app.module({
            name: 'blog',
            path: '/',
            component: {
                name: 'BlogPosts',
                computed: {
                    ...mapState(['collection']),
                },
                methods: {
                    ...mapActions(['load']),
                },
                mounted() {
                    this.load();
                },
                render(h) {
                    return h('ul', this.collection.map(post => h('li', post.title)));
                },
            },
            store: {
                state: {
                    collection: [],
                },
                mutations: {
                    store(state, posts) {
                        state.collection = posts;
                    },
                },
                actions: {
                    load({commit}) {
                        setTimeout(() => {
                            commit('store', [
                                {title: 'First article'},
                                {title: 'Second article'},
                                {title: 'Third article'},
                            ]);
                        }, 35);
                    },
                },
            },
        }).$mount();

        setTimeout(() => {
            expect(app.$el.outerHTML).toMatchSnapshot();
            done();
        }, 50);
    });

    it('should register several modules', done => {
        app.module([{
            name: 'user',
            store: {
                state: {
                    isLoggedIn: false,
                    name: 'Anonymous',
                },
                mutations: {
                    store(state, user) {
                        state.name = user.name;
                        state.isLoggedIn = true;
                    },
                },
                actions: {
                    logIn({commit}) {
                        setTimeout(() => {
                            commit('store', {name: 'John'});
                        }, 35);
                    },
                },
            },
        }, {
            name: 'products',
            path: '/',
            component: {
                name: 'Products',
                computed: {
                    ...mapState({products: 'collection'}),
                    ...mapState('user', {
                        user: 'name',
                        isLoggedIn: 'isLoggedIn',
                    }, {root: true}),
                },
                render(h) {
                    return h('div', [
                        this.isLoggedIn
                            ? h('p', `Hello, ${this.user}`)
                            : h('p', 'Please, log in'),

                        h('h1', 'Products'),
                        h('ul', this.products.map(product => h('li', product.title))),
                    ]);
                },
            },
            store: {
                state: {
                    collection: [
                        {title: 'Product 1'},
                        {title: 'Product 2'},
                    ],
                },
            },
        }]).$mount();

        setTimeout(() => {
            expect(app.$el.outerHTML).toMatchSnapshot();

            // log in user
            app.$store.dispatch('user/logIn');

            setTimeout(() => {
                expect(app.$el.outerHTML).toMatchSnapshot();
                done();
            }, 50);
        }, 50);
    });
});
