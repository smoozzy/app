import Vue from 'vue';
import {normalize} from './utils/module';


export default {
    /**
     * Registers component
     *
     * @see https://vuejs.org/v2/api/#Vue-component
     * @param {string} id
     * @param {AsyncComponent|Component} definition
     * @return {Vue}
     */
    component(id, definition) {
        if (!definition) {
            return Vue.component(id);
        }

        Vue.component(id, definition);

        return this;
    },

    /**
     * Registers directive
     *
     * @see https://vuejs.org/v2/api/#Vue-directive
     * @param {string} id
     * @param {DirectiveFunction|DirectiveOptions} definition
     * @return {DirectiveFunction|DirectiveOptions|Vue}
     */
    directive(id, definition) {
        if (!definition) {
            return Vue.directive(id);
        }

        Vue.directive(id, definition);

        return this;
    },

    /**
     * Registers filter
     *
     * @see https://vuejs.org/v2/api/#Vue-filter
     * @param {string} id
     * @param {function} definition
     * @return {function|Vue}
     */
    filter(id, definition) {
        if (!definition) {
            return Vue.filter(id);
        }

        Vue.filter(id, definition);

        return this;
    },

    /**
     * Applies mixin
     *
     * @see https://vuejs.org/v2/api/#Vue-mixin
     * @param {ComponentOptions} mixin
     * @return {Vue}
     */
    mixin(mixin) {
        Vue.mixin(mixin);

        return this;
    },

    /**
     * Registers app modules
     *
     * @param {AppModule|AppModule[]} module
     * @return {Vue}
     */
    module(module) {
        const modules = (Array.isArray(module) ? module : [module])
            .map(normalize, this)  // normalize all modules
            .filter(route => Boolean(route.path));  // filter modules with path and add as router routes

        this.$router.addRoutes(modules);

        return this;
    },

    /**
     * Registers Vue plugin
     *
     * @see https://vuejs.org/v2/api/#Vue-use
     * @param {PluginObject|PluginFunction} plugin
     * @param {Object} [options]
     * @return {Vue}
     */
    use(plugin, options) {
        Vue.use(plugin, options);

        return this;
    },
};
