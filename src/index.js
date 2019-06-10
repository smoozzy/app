import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import SBootstrap from './components/bootstrap';
import methods from './methods';
import {RootStore} from './utils/store';

// reexport router, root store and helpers
export {
    Router,
};
export {
    RootStore as Store,
    mapState,
    mapGetters,
    mapMutations,
    mapActions
} from './utils/store';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(Vuex);


/**
 * @typedef {Object} AppOptions
 * @extends {ComponentOptions}
 * @property {RouterOptions|VueRouter} [router]
 * @property {StoreOptions|Store} [store]
 */

/**
 * Creates Vue app
 *
 * @param {AppOptions} [options={}]
 * @return {Vue}
 */
export default function bootstrap(options = {}) {
    const {
        router: routerOptions,
        store: storeOptions,
        methods: methodsOptions,
        ...app  // additional app options
    } = options;

    // prepare router and store
    const router = routerOptions instanceof Router
        ? routerOptions
        : new Router(Object.assign({
            mode: 'history',
            base: process.env.BASE_URL,
        }, routerOptions));

    const store = storeOptions instanceof RootStore
        ? storeOptions
        : new RootStore(Object.assign({
            strict: process.env.NODE_ENV !== 'production'
        }, storeOptions));

    sync(store, router);

    // create application
    return new Vue(Object.assign(app, {
        router,
        store,
        methods: Object.assign(methods, methodsOptions),
        render: h => h(SBootstrap),
    }));
}
