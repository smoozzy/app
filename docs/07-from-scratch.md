## Bootstrap from scratch

If you like our bootstrap, but you want to change it. For example remove some plugin. You can write your own application bootstrap. 

Under the hood, the bootstrap does the following magic:

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import SBootstrap from '@smoozzy/app/src/components/bootstrap';
import methods from '@smoozzy/app/src/methods';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(Vuex);


// init plugins
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    // ... router options
});

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    // ... vuex options
});

sync(store, router);

// create Vue application
new Vue({
    router,
    store,
    methods: {
        ...methods,
        // ... other app methods
    },
    render: h => h(SBootstrap),
});
```
