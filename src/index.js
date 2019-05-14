import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import SBootstrap from './components/bootstrap';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(Vuex);


/**
 * @typedef {Object} AppOptions
 * @extends {ComponentOptions}
 * @property {RouterOptions} [router]
 * @property {StoreOptions} [store]
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
        ...app  // additional app options
    } = options;

    // prepare router and store
    const router = new Router(Object.assign({
        mode: 'history',
        base: process.env.BASE_URL,
    }, routerOptions));

    const store = new Vuex.Store(Object.assign({
        strict: process.env.NODE_ENV !== 'production'
    }, storeOptions));

    sync(store, router);

    // create application
    return new Vue(Object.assign(app, {
        router,
        store,
        render: h => h(SBootstrap),
    }));
}
