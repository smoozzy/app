import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';

import bootstrap from '@/index';


describe('Application bootstrap', () => {
    it('should be Vue instance', () => {
        const app = bootstrap();

        expect(app).toBeInstanceOf(Vue);
    });

    it('should be configurable', () => {
        const dataMock = jest.fn(() => ({
            property: 'test',
        }));

        const app = bootstrap({
            data: dataMock,
        });

        expect(dataMock).toBeCalled();
        expect(app.property).toBe('test');
    });

    it('should be mountable', () => {
        const vm = bootstrap().$mount();

        expect(vm.$el.outerHTML).toMatchSnapshot();
    });
});

describe('Application bootstrap: router', () => {
    it('should have router', () => {
        const app = bootstrap();

        expect(app.$router).toBeInstanceOf(Router);
    });

    it('router should be configurable', () => {
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

        const vm = bootstrap({
            router: {
                routes: [homeRoute]
            }
        }).$mount();

        expect(vm.$el.outerHTML).toMatchSnapshot();
    });

    it('router should be replaced by user instance', () => {
        const router = new Router({
            mode: 'history',
        });

        const app = bootstrap({
            router,
        });

        expect(app.$router === router).toBeTruthy();
    });
});

describe('Application bootstrap: store', () => {
    it('should have store', () => {
        const app = bootstrap();

        expect(app.$store).toBeInstanceOf(Vuex.Store);
    });

    it('store should be configurable', () => {
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

        const app = bootstrap({
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
        }

        expect(app.$store.state).toEqual({
            property: 'test',
            route: Object.assign({}, clonedRoute, {
                from: clonedRoute,
            }),
        });

        expect(app.$store.getters.theSameProperty).toBe('test');
    });

    it('store should be replaced by user instance', () => {
        const store = new Vuex.Store();

        const app = bootstrap({
            store,
        });

        expect(app.$store === store).toBeTruthy();
    });
});
