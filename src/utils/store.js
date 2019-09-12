import Vuex from 'vuex';

const {Store} = Vuex;


/* Root store
 */


/**
 * Creates module store and registers it as module in root store
 *
 * @param {Store} rootStore
 * @param {string|string[]} path
 * @param {StoreOptions|Module} module
 * @param {ModuleOptions} [options]
 * @return {ModuleStore}
 */
export function registerModuleStore(rootStore, path, module, options) {
    const modulePath = typeof path === 'string' ? [path] : path;

    // always register module store as namespaced module
    module.namespaced = true;

    // check params and register module
    rootStore.registerModule(modulePath, module, options);

    // create module store (avoid re-initialization of nested modules)
    const moduleStore = new Store({
        state: rootStore._modules.get(modulePath).state,
    });

    // init internal strucures of module store
    initNestedModules(moduleStore, module);
    initModuleMethods(rootStore, moduleStore, modulePath, [], module);

    // now mutations will run in scope of root store, but
    // commiting flag will be setted in scope of module store
    moduleStore._withCommit = function _withCommit(fn) {
        // root store
        const rootCommitting = rootStore._committing;
        rootStore._committing = true;

        // module store
        const committing = this._committing;
        this._committing = true;
        fn();

        this._committing = committing;
        rootStore._committing = rootCommitting;
    };

    return moduleStore;
}

/**
 * Setups internal structures in module stores
 *
 * @param {Store} store
 * @param {StoreOptions|Module} module
 */
function initNestedModules(store, module) {
    /**
     * Creates new copy of module options
     *
     * @param {StoreOptions|Module} module
     * @return {StoreOptions|Module}
     */
    function getModulesTree(module) {
        const {
            namespaced = false,
            state,
            modules,
        } = module;

        return {
            namespaced,
            state,
            modules: Object.entries(modules || {}).reduce((memo, [name, nestedModule]) => {
                memo[name] = getModulesTree(nestedModule);
                return memo;
            }, {}),
        };
    }

    // register nested modules of first level (other levels will register automatically)
    Object.entries(getModulesTree(module).modules).forEach(([name, nestedModule]) => {
        store._modules.register([name], nestedModule, false);
    });
}

/**
 * Setups getters, mutations and actions of module store
 *
 * @param {Store} rootStore
 * @param {Store} moduleStore
 * @param {string[]} prefix - module path in root store
 * @param {string[]} path - module path in module store
 * @param {StoreOptions|Module} module
 */
function initModuleMethods(rootStore, moduleStore, prefix, path, module) {
    const {
        getters = {},
        mutations = {},
        actions = {},
        modules = {},
    } = module;

    const rootNamespace = rootStore._modules.getNamespace(prefix.concat(path));
    const moduleNamespace = moduleStore._modules.getNamespace(path);

    // getters
    Object.keys(getters).forEach(name => {
        const rootKey = rootNamespace + name;
        const moduleKey = moduleNamespace + name;

        moduleStore._wrappedGetters[moduleKey] = rootStore._wrappedGetters[rootKey];

        Object.defineProperty(moduleStore.getters, moduleKey, {
            get() {
                return rootStore._vm[rootKey];
            },
            enumerable: true,
        });
    });

    // mutations
    Object.keys(mutations).forEach(name => {
        moduleStore._mutations[moduleNamespace + name] = rootStore._mutations[rootNamespace + name];
    });

    // actions
    Object.keys(actions).forEach(name => {
        moduleStore._actions[moduleNamespace + name] = rootStore._actions[rootNamespace + name];
    });

    // nested modules
    Object.entries(modules).forEach(([name, nestedModule]) => {
        initModuleMethods(rootStore, moduleStore, prefix, path.concat(name), nestedModule);
    });
}


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
