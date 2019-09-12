# Vue plugins

The bootstrap creates a Vue application with the following plugins:

- [Vue Router](http://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org)

You can configure via application options. Plugin options format is the same as in documentation.

```javascript
import bootstrap from '@smoozzy/app';

bootstrap({
    // Router options
    router: {
        // default options, feel free to override it
        mode: 'history',
        base: process.env.BASE_URL,    
    },
    
    // Vuex options
    store: {
        // default options
        strict: process.env.NODE_ENV !== 'production',
    },
}).$mount('#app');
```

Also you can pass own instance of plugin in application options. We decided to simplify your life and reexported `Router` and `Store` from the bootstrap.

```javascript
import bootstrap, {
    Router,  // re-exprort from Vue Router
    Store,   // re-exprort from Vuex
} from '@smoozzy/app';


const router = new Router({ /* Router configuration */ });
const store = new Store({ /* Vuex configuration */ });

bootstrap({
    router,
    store,
}).$mount('#app');
```


## Migration to the bootstrap

Migration is very simple process. You should replace own bootstap code to our implementation. If you use additional setup of Router or Store you should use ones from the bootsrap exports. Router and Store are the same as ones from `vue-router` and `vuex` packages. But Store from the bootsrap has additional functional to support [application modules](./03-modules.md).

Also in your bundle you can patch Vuex exports. It allows you don't rewrite other code.

```javascript
import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} from '@smoozzy/app';
import Vuex from 'vuex';

// patching Vuex
Vuex.mapState = mapState;
Vuex.mapGetters = mapGetters;
Vuex.mapMutations = mapMutations;
Vuex.mapActions = mapActions;
```
