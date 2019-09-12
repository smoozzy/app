# Modules

Let discuss what is module of Vue application? Module consists from:

- views (pages)
- components that used by views
- store data and methods

It means we can describe module as routes config and store module. It looks like independent Vue application that we can plug to our application. Sounds very strange :)

Let look at example.


## Example

Module entry point:

```javascript
import Layout from './components/layout.vue';
import Overview from './view/overview.vue';
import Item from './view/item.vue';
import store from './store';

export default {
    name: 'module',               // module name (also route name)
    path: '/module-path',         // default module path
    component: Layout,            // module layout component
    store,                        // store options
    children: [                   // definition of children routes
        {
            path: '',             // default children route (it can be empty string and slash ('/'))
            component: Overview,  // route view
        },
        {
            path: ':id',
            component: Item,
        },
    ],
};
```

It is usual definition of routes in application. Also we provide store data and when module will initialize the bootstrap will create store module.

Following example shows how you can add module to application:

```javascript
import bootstrap from '@smoozzy/app';
import module from './modules/module';

bootstrap()
    .module(module)
    .$mount('#app');
```


## Module routes

Module routes is the same as any different routes in your application. It uses Vue Router and has the same configuration options. See [Vue Router documentation](https://router.vuejs.org/).

In most cases module has root path like `/shop`, `/profile`, `/auth`, etc. And we think you as module creator should define default module path. If user want to override default module path the user can do it with ease. For example:

```javascript
import bootstrap from '@smoozzy/app';
import module from './modules/module';

bootstrap()
    .module({
        ...module,
        path: '/my/custom/module-path',
    })
    .$mount('#app');
```


## Store

Working with Store in module is more complicated issue. We have simple API that can register store module. But there are many restrictions for this solution. And the main restriction is a name of store module. Module components and views uses the module name to map state, getters, mutations and action. You need the correct module name to access module data from other modules. And you must have possibility to change the module name in any time without rewriting other code.

We can put module store as independ Store in module root component and link with application store. It will be better if solution will allow us not to use the module name when we map store data and methods in component.

But this solution restricts access to application store. We can extend the store mapping helpers. they can have third param that tells it should map data from application store not from module store.

Let look at example:

```javascript
/* Module view: Overview
 */

import {
    mapGetters,
    mapActions,
} from '@smoozzy/app';


export default {
    name: 'OverviewView',

    computed: {
        // mapping getters from module store
        ...mapGetters([
            'isLoading',
            'collection',
        ]),

        // mapping getters from application store
        ...mapGetters('auth', ['isAuthenticated'], {
            root: true,
        }),
    },

    methods: {
        // mapping actions from module store
        ...mapActions('load'),
    },
};
```

```javascript
/* Module store
 */

import api from '@/app/api';  // for example

export default {
    state: {
        isLoaded: false,
        isLoading: false,
        collection: [],
    },

    getters: {
        isLoaded(state, getters, rootState, rootGetters) {
            // check data in other module via `rootState` and `rootGetters`
            return state.isLoaded && rootGetters['profile/isLoaded'];
        },

        isLoading(state) {
            return state.isLoading;
        },

        collection(state) {
            return state.collection;
        }
    },

    mutations: {
        fill(state, data) {
            state.collection = data;
        },
    },

    actions: {
        load({commit, dispatch}) {
            // load related data from other module
            return dispatch('dictionaries/productCategories/load', {root: true})
                .then(() => api.get('products/overview'))
                .then(data => commit('fill', data));
        },
    },
};
```
