import Vue from 'vue';
import Vuex from 'vuex';
import {
    RootStore,
    ModuleStore,
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


describe('Vuex defaults', () => {
    // save original method
    const {commit} = Store.prototype;

    // mock `commit` method
    const mock = jest.fn();
    Store.prototype.commit = mock;

    // create store
    const store = new Store({
        state: {
            counter: 0,
        },
        mutations: {
            increment(state) {
                state.counter += 1;
            },
        },
    });

    // restore original method
    // it should not affect store instance, see explanation in `src/utils/store.js`
    Store.prototype.commit = commit;


    it('store should not have internal property `stores`', () => {
        expect(store._stores).toBeUndefined();
    });

    it('store should not have method `registerModuleStore`', () => {
        expect(store.registerModuleStore).toBeUndefined();
    });

    it('store should not have method `unregisterModuleStore`', () => {
        expect(store.unregisterModuleStore).toBeUndefined();
    });

    it('store should not have method `unlink`', () => {
        expect(store.unlink).toBeUndefined();
    });

    it('store should have bounded method `commit`', () => {
        expect(store.commit).not.toEqual(commit);
    });

    it('bounded method `commit` should call method with the same name from prototype', () => {
        store.commit('increment');

        expect(mock).toHaveBeenCalled();
    });
});

describe('Utils: store', () => {
    it('root store should be instance of Vuex store', () => {
        const store = new RootStore();

        expect(store).toBeInstanceOf(Store);
    });

    it('module store should be instance of Vuex store', () => {
        const rootStore = new RootStore();
        const moduleStore = new ModuleStore({}, rootStore);

        expect(moduleStore).toBeInstanceOf(Store);
    });

    it('root store should not register module as root module', () => {
        const rootStore = new RootStore();

        expect(() => {
            rootStore.registerModuleStore([], getModuleMock());
        }).toThrow();
    });

    it('root store should register module', () => {
        const rootStore = new RootStore();
        let moduleStore;

        expect(() => {
            moduleStore = rootStore.registerModuleStore('profile', getModuleMock());
        }).not.toThrow();

        expect(rootStore.state.profile.nickname).toBe('somebody');

        expect(moduleStore).toBeInstanceOf(ModuleStore);
        expect(moduleStore.state.nickname).toBe('somebody');
    });

    it('root store should unregister module', () => {
        const rootStore = new RootStore();
        const moduleStore = rootStore.registerModuleStore('profile', getModuleMock());

        rootStore.unregisterModuleStore('profile');
        moduleStore.commit('setNickname', 'odin');

        expect(rootStore.state.profile).toBeUndefined();
        expect(moduleStore.state.nickname).toBe('odin');
    });

    it('root store should do nothing if module do not exist', () => {
        const rootStore = new RootStore();

        expect(() => {
            rootStore.unregisterModuleStore(['profile']);
        }).not.toThrow();
    });

    it('root and module stores should not raise exception on internal mutation', () => {
        const rootStore = new RootStore();
        const moduleStore = rootStore.registerModuleStore(['profile'], getModuleMock());

        // mutations
        moduleStore.commit('setNickname', 'odin');
        expect(rootStore.state.profile.nickname).toBe('odin');

        rootStore.commit('profile/setNickname', 'thor');
        expect(moduleStore.state.nickname).toBe('thor');

        // actions
        moduleStore.dispatch('load', {name: 'loki'});
        expect(rootStore.getters['profile/name']).toBe('loki');

        rootStore.dispatch('profile/load', {name: 'balder'});
        expect(moduleStore.getters.name).toBe('balder');
    });
});

describe('Utils: store helpers', () => {
    describe('for application (app component)', () => {
        const rootStore = new RootStore(getRootMock());
        const moduleStore = rootStore.registerModuleStore('profile', getModuleMock());

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
        const rootStore = new RootStore(getRootMock());
        const moduleStore = rootStore.registerModuleStore('profile', getModuleMock());

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
