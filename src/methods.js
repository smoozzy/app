import Vue from 'vue';


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
     * @return {Vue}
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
     * @return {Vue}
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
