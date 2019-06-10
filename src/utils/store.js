import Vuex from 'vuex';
import {extend} from './index';

/* Explanation: why we need this black magic with store constructor
 *
 * In strict mode a store runs watcher that monitors any change from outside.
 * There are only one correct way to change state it is mutation or
 * the `commit` method (mutation internally uses the `commit` method).
 *
 * We try to replace the `commit` method to support tracking of a changes and
 * manage committing flag in the both of stores (root and module) at the same
 * time.
 *
 * Let's look at store constructor. We see initialization of internal structures,
 * overriding of the `commit` method and registration of options (store param)
 * as root module (creating of module collection). Next step is initialization
 * of submodules, mutations and actions. See `installModule` function.
 * (https://github.com/vuejs/vuex/blob/dev/src/store.js)
 *
 * `installModule` function creates local context for wrappers of mutations and
 * actions that uses overridden `commit` method (by Store constructor).
 * It means we can not replace the `commit` method for mutations and actions
 * of root module. Following code will produce error in tests because we try
 * to replace `commit` method after parent did initialization of root module:
 *
 * ```js
 * class MyStore extends Store {
 *     constructor(options) {
 *         super(options);
 *
 *         this.commit = function myCommitMethod() {};
 *     }
 * }
 * ```
 *
 * You can ask why can not use a magic with ES6 class syntax? We have restriction
 * with `super` keyword. See description on MDN.
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super#Description)
 *
 * Our implementation try to replace the `commit` method at runtime parent
 * constructor.
 *
 * Enjoy!
 */

const {Store} = Vuex;
const NAMESPACE_DIVIDER = '/';

/* Root store
 */

/**
 * Constructs root store
 *
 * @constructor
 * @extends Store
 * @param {StoreOptions} [options]
 * @return {RootStore}
 */
export function RootStore(options) {
    // saved origin commit method from parent constructor
    let /** @type function */ originalCommit;

    // plugged module stores
    /** @type Object<string,ModuleStore> */
    this._stores = {};

    const that = this;

    // workaround for guard in strict mode (module store)
    function commit(type, payload, options) {
        const path = type.split(NAMESPACE_DIVIDER);
        path.pop();  // remove mutation name

        const module = that._stores[path.join(NAMESPACE_DIVIDER)];
        let committing;

        if (module) {  // set committing status if module exists
            committing = module._committing;
            module._committing = true;
        }

        // run mutation
        originalCommit(type, payload, options);

        if (module) {  // restore committing status
            module._committing = committing;
        }
    }

    // black magic to manage the `commit` method
    Object.defineProperty(this, 'commit', {
        get() {
            // return method from prototype until parent constructor overrides it
            return originalCommit ? commit : Store.prototype.commit;
        },
        set(/** @type function */ value) {
            originalCommit = value;
        }
    });

    // call parent constructor
    Store.call(this, options);
}

RootStore.prototype = {
    /**
     * Creates module store and registers it as module in root store
     *
     * @this RootStore
     * @param {string|string[]} path
     * @param {StoreOptions|Module} module
     * @param {ModuleOptions} [options]
     * @return {ModuleStore}
     */
    registerModuleStore(path, module, options) {
        const {
            namespaced = false,
        } = module;

        // always register module store as namespaced module
        module.namespaced = true;

        // check params and register module
        this.registerModule(path, module, options);
        module.namespaced = namespaced;

        const moduleStore = new ModuleStore(module, this);
        this._stores[typeof path === 'string' ? path : path.join(NAMESPACE_DIVIDER)] = moduleStore;

        return moduleStore;
    },

    /**
     * Unregisters module store
     *
     * @this RootStore
     * @param {string|string[]} path
     */
    unregisterModuleStore(path) {
        const key = typeof path === 'string' ? path : path.join(NAMESPACE_DIVIDER);
        const /** @type ModuleStore */ moduleStore = this._stores[key];

        // check module store
        if (!moduleStore) {
            return false;
        }

        // unlink module store from root store
        moduleStore.unlink();
        this._stores[key] = null;

        this.unregisterModule(path);
    },
};

extend(RootStore, Store);


/* Module store
 */

/**
 * Constructs module store
 *
 * @constructor
 * @extends Store
 * @param {StoreOptions} options
 * @param {RootStore} rootStore
 * @return {ModuleStore}
 */
export function ModuleStore(options, rootStore) {
    // saved origin commit method from parent constructor
    let /** @type function */ originalCommit;

    // workaround for guard in strict mode (module store)
    function commit(type, payload, options) {
        const committing = rootStore._committing;
        rootStore._committing = true;
        originalCommit(type, payload, options);
        rootStore._committing = committing;
    }

    // black magic to manage the `commit` method
    Object.defineProperty(this, 'commit', {
        get() {
            // return method from prototype until parent constructor overrides it
            return originalCommit ? commit : Store.prototype.commit;
        },
        set(/** @type function */ value) {
            originalCommit = this._originalCommit = value;
        }
    });

    // call parent constructor
    Store.call(this, options);
}

ModuleStore.prototype = {
    /**
     * Restores origin commit method and removes relationship with root store
     *
     * @this ModuleStore
     */
    unlink() {
        this.commit = this._originalCommit;
    }
};

extend(ModuleStore, Store);


/* Wrapping of Vuex helper methods
 */

/**
 * Changes context to root component for given function
 *
 * @param {function} fn
 * @return {function(...*): *}
 */
function changeContext(fn) {
    return function setRootContext(...args) {
        return fn.apply(this.$root, args);
    };
}

/**
 * Wraps mapper (vuex helper) to provide options param
 * that allows to switch context to root component
 *
 * @param {function(string, Array|Object): Object<string,function>} mapper
 * @result {function(string, Array|Object, {root: boolean}): Object<string,function>}
 */
function wrapMapper(mapper) {
    return function mapSection(namespace, section, options = {}) {
        const map = mapper(namespace, section);

        const params = typeof namespace === 'string'
            ? options
            : (section || options);  // `options` is default value here

        if (!params.root) {
            return map;
        }

        return Object.entries(map).reduce((memo, [key, fn]) => {
            memo[key] = changeContext(fn);
            return memo;
        }, {});
    };
}

export const mapState = wrapMapper(Vuex.mapState);
export const mapGetters = wrapMapper(Vuex.mapGetters);
export const mapMutations = wrapMapper(Vuex.mapMutations);
export const mapActions = wrapMapper(Vuex.mapActions);
