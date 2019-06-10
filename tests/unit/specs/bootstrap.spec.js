import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import bootstrap, {
    Store,
} from '@/index';


describe('Bootstrap: application', () => {
    let app;

    afterEach(() => {
        // @see https://vuejs.org/v2/api/#vm-destroy
        app.$destroy();
    });

    it('should be Vue instance', () => {
        app = bootstrap();

        expect(app).toBeInstanceOf(Vue);
    });

    it('should be configurable (property `data`)', () => {
        const dataMock = jest.fn(() => ({
            property: 'test',
        }));

        app = bootstrap({
            data: dataMock,
        });

        expect(dataMock).toBeCalled();
        expect(app.property).toBe('test');
    });

    it('should be configurable (property `methods`)', () => {
        const methodMock = jest.fn(() => 42);

        app = bootstrap({
            methods: {
                getQuestionOfLife: methodMock,
            }
        });

        expect(typeof app.getQuestionOfLife).toBe('function');
        expect(app.getQuestionOfLife()).toBe(42);
        expect(typeof app.component).toBe('function');
        expect(app.component('yet-another-component')).not.toBeDefined();
    });

    it('should be mountable', () => {
        app = bootstrap().$mount();

        expect(app.$el.outerHTML).toMatchSnapshot();
    });
});

describe('Bootstrap: router', () => {
    let app;

    afterEach(() => {
        app.$destroy();
    });

    it('should be instance of Vue Router', () => {
        app = bootstrap();

        expect(app.$router).toBeInstanceOf(Router);
    });

    it('should be configurable', () => {
        const homeRoute = {
            name: 'home',
            path: '/',
            component: {
                name: 'Home',
                render(h) {
                    // We have no runtime template compiler
                    // @see https://vuejs.org/v2/guide/render-function.html
                    //
                    // <div class="home">
                    //     Home component
                    // </div>
                    return h('div', {
                        attrs: {
                            class: 'home',
                        }
                    }, [
                        'Home component',
                    ]);
                }
            },
        };

        app = bootstrap({
            router: {
                routes: [homeRoute]
            }
        }).$mount();

        expect(app.$el.outerHTML).toMatchSnapshot();
    });

    it('should be replaced by user instance', () => {
        const router = new Router();

        app = bootstrap({
            router,
        });

        expect(app.$router === router).toBeTruthy();

        // cleaning: router uses a hash mode
        location.replace('/');
    });
});

describe('Bootstrap: store', () => {
    let app;

    afterEach(() => {
        app.$destroy();
    });

    it('should be instance of Vuex Store', () => {
        app = bootstrap();

        expect(app.$store).toBeInstanceOf(Vuex.Store);
    });

    it('should be configurable', () => {
        const store = {
            state: {
                property: 'test',
            },
            getters: {
                theSameProperty(state) {
                    return state.property;
                },
            },
        };

        app = bootstrap({
            store,
        });

        const {currentRoute} = app.$router;
        const clonedRoute = {
            // remove property `matched`
            // @see https://github.com/vuejs/vuex-router-sync/blob/master/src/index.js#L60-L74
            name: currentRoute.name,
            path: currentRoute.path,
            fullPath: currentRoute.fullPath,
            hash: currentRoute.hash,
            query: currentRoute.query,
            params: currentRoute.params,
            meta: currentRoute.meta,
            from: currentRoute.from,
        };

        expect(app.$store.state).toEqual({
            property: 'test',
            route: Object.assign({}, clonedRoute, {
                from: clonedRoute,
            }),
        });
        expect(app.$store.getters.theSameProperty).toBe('test');
    });

    it('should be replaced by user instance of root store', () => {
        const store = new Store();  // root store

        app = bootstrap({
            store,
        });

        expect(app.$store === store).toBeTruthy();
    });
});
