import {assert} from './index';


/**
 * @typedef {Object} AppModule
 * @extends {RouteConfig}
 * @property {string} name - 'module' - used as route name and store module name
 * @property {StoreOptions} [store] - plugs store module on app initialisation
 */


/**
 * Returns component wrapper
 *
 * @param {function|ComponentOptions} component
 * @param {Object} extension
 * @param {ModuleStore} [extension.store]
 * @return {function(): Promise<ComponentOptions>}
 */
function getComponentWrapper(component, extension) {
    return function componentWrapper() {
        const promise = typeof component === 'function'
            ? component()  // dynamic loading
            : Promise.resolve(component);  // static loading

        return promise.then(component => Object.assign(component, extension));
    };
}

/**
 * Normalizes children route names
 *
 * @param {AppModule} module
 * @return {RouteConfig}
 */
function normalizeRouteNames(module) {
    const {
        name,
        children,
        /** @type RouteConfig */ ...route
    } = module;

    if (Array.isArray(children)) {
        // we assume if module has children one will have name

        // find overview (default) page in nested routes
        const overview = children.find(({path}) => !path /* path is empty string or undefined */ || path === '/');

        if (overview === undefined) {
            route.name = name;
        } else {
            // Fix: [vue-router] named route has a default child route (path: '' or '/').
            // When navigating to this named route, the default child route will not be rendered.
            overview.name = name;
        }

        // check children routes
        route.children = children.map(normalizeRouteNames);

    } else if (name !== undefined) {
        // it can be route with redirect only
        route.name = name;
    }

    return route;
}

/**
 * Normalizes app module
 *
 * Converts module config to route config, registers store module and modals
 *
 * @param {AppModule} module
 * @return {RouteConfig}
 */
export function normalize(module) {
    const {
        name,
        component,
        components,
        store,
    } = module;

    const route = normalizeRouteNames(module);

    // extends module with properties like store
    const extension = {};

    if (store !== undefined) {
        // prevent to replace module by module with the same name
        assert(!this.$store.state[name], 'root store should not have module with the same name');
        extension.store = this.$store.registerModuleStore(name, store);
    }

    // loading of vue components
    if (component !== undefined) {
        route.component = getComponentWrapper(component, extension);
    }
    if (components !== undefined) {
        route.components = Object.entries(components).reduce((memo, [name, component]) => {
            memo[name] = getComponentWrapper(component, extension);
            return memo;
        }, {});
    }

    return route;
}
