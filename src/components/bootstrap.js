export default {
    name: 'SBootstrap',

    render(h) {
        /*
         * <div class="s-bootstrap">
         *     <router-view />
         * </div>
         */
        return h('div', {
            staticClass: 's-bootstrap',
        }, [
            h('router-view'),
        ]);
    },
};
