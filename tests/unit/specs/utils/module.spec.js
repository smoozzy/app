import Vue from 'vue';
import Vuex from 'vuex';
import {normalize} from '@/utils/module';
import {RootStore} from '@/utils/store';

Vue.use(Vuex);

function getRootComponentMock() {
    return {
        $store: new RootStore({
            strict: true,
        }),
    };
}


describe('Module utils', () => {
    it('should fix navigation to default children route', () => {
        // case: no children
        expect(normalize({
            name: 'auth',
            path: '/auth',
        })).toMatchSnapshot();

        // case: children with own paths
        expect(normalize({
            name: 'auth',
            path: '/auth',
            children: [{
                name: 'signin',
                path: 'signin',
            }, {
                name: 'signup',
                path: 'signup',
            }],
        })).toMatchSnapshot();

        // case: child with default route
        expect(normalize({
            name: 'auth',
            path: '/auth',
            children: [{
                name: 'signin',
                path: '',  // default route
            }, {
                name: 'signup',
                path: 'signup',
            }],
        })).toMatchSnapshot();

        // case: default child route without defined path
        expect(normalize({
            name: 'auth',
            path: '/auth',
            children: [{
                name: 'signin', // default child route
            }, {
                name: 'signup',
                path: 'signup',
            }],
        })).toMatchSnapshot();

        // case: routes without name
        expect(normalize({
            path: '*',
            redirect: {
                name: 'page404',
            },
        })).toMatchSnapshot();
    });

    it('should have name if uses store', () => {
        expect(() => {
            normalize({
                path: '/auth',
                store: {
                    state: {},
                },
            });
        }).toThrow();
    });

    it('should raise error if exists store module with the same name', () => {
        const root = getRootComponentMock();

        root.$store.registerModule('auth', {
            state: {
                module: 'auth-root',
            },
        });

        expect(() => {
            normalize.call(root, {  // setup correct `this`
                name: 'auth',
                path: '/auth',
                store: {
                    state: {
                        module: 'auth',
                    },
                },
            });
        }).toThrow();
    });

    it('should register module store as module in root store', () => {
        const root = getRootComponentMock();

        normalize.call(root, {  // setup correct `this`
            name: 'auth',
            path: '/auth',
            store: {
                state: {
                    module: 'auth',
                },
                getters: {
                    module(state) {
                        return state.module;
                    },
                },
            },
        });

        expect(root.$store.state.auth.module).toBe('auth');
        expect(root.$store.getters['auth/module']).toBe('auth');
    });

    it('should register local store for module component', done => {
        const root = getRootComponentMock();

        const route = normalize.call(root, {  // setup correct `this`
            name: 'math',
            path: '/math',
            component: {
                name: 'Math',
                render: h => h('div', 'Math page'),
            },
            store: {
                state: {
                    counter: 1,
                },
                getters: {
                    square(state) {
                        return Math.pow(state.counter, 2);
                    },
                },
                mutations: {
                    increment(state) {
                        state.counter += 1;
                    },
                },
            },
        });

        route.component().then(component => {
            // root store
            expect(root.$store.state.math.counter).toBe(1);
            expect(root.$store.getters['math/square']).toBe(1);

            // local store
            expect(component.store instanceof Vuex.Store).toBeTruthy();
            expect(component.store.state.counter).toBe(1);
            expect(component.store.getters.square).toBe(1);

            // changing via root store mutation
            root.$store.commit('math/increment')

            expect(root.$store.state.math.counter).toBe(2);
            expect(root.$store.getters['math/square']).toBe(4);

            expect(component.store.state.counter).toBe(2);
            expect(component.store.getters.square).toBe(4);

            // changing via module store mutation
            component.store.commit('increment');

            expect(root.$store.state.math.counter).toBe(3);
            expect(root.$store.getters['math/square']).toBe(9);

            expect(component.store.state.counter).toBe(3);
            expect(component.store.getters.square).toBe(9);

            done();
        });
    });

    it('should register module store for each component for named views', done => {
        const root = getRootComponentMock();

        const route = normalize.call(root, {  // setup correct `this`
            name: 'statistic',
            path: '/stat',
            components: {
                linear: () => Promise.resolve({
                    name: 'LinearRegression',
                    render: h => h('div', 'Linear regression'),
                }),
                polynomial: () => Promise.resolve({
                    name: 'PolynomialRegression',
                    render: h => h('div', 'Polynomial regression'),
                }),
            },
            store: {
                state: {
                    name: 'statistic',
                },
            },
        });

        Promise.resolve()
            .then(() => {
                // root store
                expect(root.$store.state.statistic.name).toBe('statistic');
            })
            .then(() => {
                // linear component store
                return route.components.linear().then(component => {
                    expect(component.store instanceof Vuex.Store).toBeTruthy();
                    expect(component.store.state.name).toBe('statistic');
                });
            })
            .then(() => {
                // polynomial component store
                return route.components.polynomial().then(component => {
                    expect(component.store instanceof Vuex.Store).toBeTruthy();
                    expect(component.store.state.name).toBe('statistic');
                });
            })
            .then(done);
    });
});
