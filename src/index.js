import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import SBootstrap from './components/bootstrap';
import methods from './methods';


const {Store} = Vuex;

// re-export router, store and helpers
export {
    Router,
    Store,
};
export {
    mapState,
    mapGetters,
    mapMutations,
    mapActions
} from './utils/store';


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
        ...otherOptions  // additional app options
    } = options;

    // add plug-ins
    Vue.config.productionTip = false;
    Vue.use(Router);
    Vue.use(Vuex);

    // prepare router and store
    const router = routerOptions instanceof Router
        ? routerOptions
        : new Router(Object.assign({
            mode: 'history',
            base: process.env.BASE_URL,
        }, routerOptions));

    const store = storeOptions instanceof Store
        ? storeOptions
        : new Store(Object.assign({
            strict: process.env.NODE_ENV !== 'production'
        }, storeOptions));

    sync(store, router);

    // create application
    const app = Object.assign(otherOptions, {
        router,
        store,
        methods: Object.assign({}, methodsOptions, methods),
    }, SBootstrap);

    return new Vue(app);
}
