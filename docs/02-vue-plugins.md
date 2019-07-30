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

Also you can pass own instance of plugin in application options

```javascript
import bootstrap from '@smoozzy/app';
import Router from 'vue-router';
import Vuex from 'vuex';

const router = new Router({ /* Router configuration */ });
const store = new Vuex.Store({ /* Vuex configuration */ });

bootstrap({
    router,
    store,
}).$mount('#app');
```
