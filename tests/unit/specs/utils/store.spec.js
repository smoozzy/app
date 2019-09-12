import Vue from 'vue';
import Vuex from 'vuex';
import {
    registerModuleStore,
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} from '@/utils/store';


Vue.use(Vuex);

const {Store} = Vuex;

function getRootMock() {
    return {
        strict: true,
        state: {
            status: 'loading',
        },
        getters: {
            isLoaded(state) {
                return state.status === 'loaded';
            },
        },
        mutations: {
            setStatus(state, status) {
                state.status = status;
            },
        },
        actions: {
            load({commit}, status = 'loaded') {
                commit('setStatus', status);
            },
        },
    };
}
function getModuleMock() {
    return {
        strict: true,
        state: {
            nickname: 'somebody',
        },
        getters: {
            name(state) {
                return state.nickname;
            },
        },
        mutations: {
            setNickname(state, nickname) {
                state.nickname = nickname;
            },
        },
        actions: {
            load({commit}, profile) {
                commit('setNickname', profile.name);
            },
        },
    };
}


describe('Utils: store', () => {
    it('root store should register module', () => {
        const rootStore = new Store({
            strict: true,
        });
        let moduleStore;

        expect(() => {
            moduleStore = registerModuleStore(rootStore, 'profile', getModuleMock());
        }).not.toThrow();

        // root store
        expect(rootStore.state.profile.nickname).toBe('somebody');

        // module store
        expect(moduleStore).toBeInstanceOf(Store);
        expect(moduleStore.state.nickname).toBe('somebody');
    });

    it('root store should not register module as root module', () => {
        const rootStore = new Store({
            strict: true,
        });

        expect(() => {
            registerModuleStore(rootStore, [], getModuleMock());
        }).toThrow();
    });

    it('root and module stores should not raise exception on internal mutation', () => {
        const rootStore = new Store({
            strict: true,
        });
        const moduleStore = registerModuleStore(rootStore, ['profile'], getModuleMock());

        // mutations
        rootStore.commit('profile/setNickname', 'thor');
        expect(moduleStore.state.nickname).toBe('thor');

        moduleStore.commit('setNickname', 'odin');
        expect(rootStore.state.profile.nickname).toBe('odin');

        // actions
        rootStore.dispatch('profile/load', {name: 'balder'});
        expect(moduleStore.getters.name).toBe('balder');

        moduleStore.dispatch('load', {name: 'loki'});
        expect(rootStore.getters['profile/name']).toBe('loki');
    });

    it('root and module stores should not raise exception on internal mutation in submodule', () => {
        const moduleStoreMock = {
            strict: true,
            getters: {
                products(state) {
                    return state.products.collection;
                },
            },
            actions: {
                load({dispatch}) {
                    return dispatch('products/load');
                },
            },
            modules: {
                products: {
                    namespaced: true,

                    state: {
                        collection: [],
                    },
                    mutations: {
                        fill(state, products) {
                            state.collection = products;
                        } ,
                    },
                    actions: {
                        load({commit}) {
                            commit('fill', [{
                                name: 'Product 1',
                            }]);
                        },
                    },
                },
                cart: {
                    state: {
                        cart: [],
                    },
                    mutations: {
                        add(state, product) {
                            state.cart.push(product);
                        },
                    },
                },
            },
        };

        const rootStore = new Store();
        const moduleStore = registerModuleStore(rootStore, 'shop', moduleStoreMock);

        // module action
        moduleStore.dispatch('products/load');
        expect(rootStore.getters['shop/products']).toEqual([{
            name: 'Product 1'
        }]);

        // root mutation
        rootStore.commit('shop/products/fill', []);
        expect(moduleStore.state.products.collection).toEqual([]);
    });
});

describe('Utils: store helpers', () => {
    describe('for application (app component)', () => {
        const rootStore = new Store(getRootMock());
        const moduleStore = registerModuleStore(rootStore, 'profile', getModuleMock());

        const profile = {  // app module
            name: 'Profile',
            store: moduleStore,
            render: h => h('div', 'Profile'),
        };
        const app = new Vue({  // app
            components: {
                profile,
            },
            store: rootStore,
            computed: {
                // global
                ...mapState(['status']),
                ...mapGetters(['isLoaded']),
                // module
                ...mapState('profile', ['nickname']),
                ...mapGetters('profile', ['name']),
                ...mapGetters({nick: 'profile/name'}),
            },
            methods: {
                // global
                ...mapMutations(['setStatus']),
                ...mapActions({loadData: 'load'}),
                // module
                ...mapMutations('profile', ['setNickname']),
                ...mapActions('profile', {loadProfile: 'load'}),

                // tests mutations
                fail() {
                    this.setNickname('error');
                    this.setStatus('error');
                },
                // test actions
                load() {
                    return Promise.all([
                        this.loadProfile({name: 'odin'}),
                        this.loadData(),
                    ]);
                },
            },
            render(h) {
                return h('div', [
                    'Wrapped Vuex helpers\n',
                    h('p', ['nickname: ', this.nickname]),
                    h('p', ['name: ', this.name]),
                    h('p', ['nick: ', this.nick]),
                    h('p', ['status: ', this.status]),
                    h('p', ['isLoaded: ', this.isLoaded === undefined ? '?' : this.isLoaded ? 'Ok' : 'waiting']),
                    h('profile'),
                ]);
            },
        }).$mount();


        afterAll(() => {
            app.$destroy();
        });

        it('should correct map state and getters', () => {
            expect(app.$el.outerHTML).toMatchSnapshot();
        });

        it('should correct map mutations', done => {
            app.fail();

            Vue.nextTick(() => {
                expect(app.$el.outerHTML).toMatchSnapshot();
                done();
            });
        });

        it('should correct map actions', done => {
            app.load().then(() => {
                Vue.nextTick(() => {
                    expect(app.$el.outerHTML).toMatchSnapshot();
                    done();
                });
            });
        });
    });

    describe('for module (module component)', () => {
        const rootStore = new Store(getRootMock());
        const moduleStore = registerModuleStore(rootStore, 'profile', getModuleMock());

        const profile = {  // app module
            name: 'Profile',
            store: moduleStore,
            computed: {
                // global
                ...mapState(['status'], {root: true}),
                ...mapGetters(['isLoaded'], {root: true}),
                // module
                ...mapState(['nickname']),
                ...mapGetters(['name']),
            },
            methods: {
                // global
                ...mapMutations(['setStatus'], {root: true}),
                ...mapActions({loadData: 'load'}, {root: true}),
                // module
                ...mapMutations(['setNickname']),
                ...mapActions({loadProfile: 'load'}),

                // tests mutations
                fail() {
                    this.setNickname('error');
                    this.setStatus('error');
                },
                // test actions
                load() {
                    return Promise.all([
                        this.loadProfile({name: 'odin'}),
                        this.loadData(),
                    ]);
                },
            },
            render(h) {
                return h('div', [
                    'Profile\n',
                    h('p', ['nickname: ', this.nickname]),
                    h('p', ['name: ', this.name]),
                    h('p', ['status: ', this.status]),
                    h('p', ['isLoaded: ', this.isLoaded === undefined ? '?' : this.isLoaded ? 'Ok' : 'waiting']),
                ]);
            },
        };
        const app = new Vue({  // app
            components: {
                profile,
            },
            store: rootStore,

            render: h => h('div', [
                'Wrapped Vuex helpers\n',
                h('profile'),
            ]),
        }).$mount();


        afterAll(() => {
            app.$destroy();
        });

        it('should correct map state and getters', () => {
            expect(app.$el.outerHTML).toMatchSnapshot();
        });

        it('should correct map mutations', done => {
            app.$children[0].fail();

            Vue.nextTick(() => {
                expect(app.$el.outerHTML).toMatchSnapshot();
                done();
            });
        });

        it('should correct map actions', done => {
            app.$children[0].load().then(() => {
                Vue.nextTick(() => {
                    expect(app.$el.outerHTML).toMatchSnapshot();
                    done();
                });
            });
        });
    });
});
