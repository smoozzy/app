# Overview

What is typical application build on Vue.js? It is bundle of four components:

- [Vue.js](https://vuejs.org/) - application skeleton
- [Vue Router](https://router.vuejs.org/) - navigation for application
- [Vuex](https://vuex.vuejs.org/) - state management and data flow
- [Vue i18n](https://kazupon.github.io/vue-i18n/) - internationalization

Each application has an entry point where these four components are initialized. It usually looks like

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';

Vue.use(Router);
Vue.use(Vuex);

new Vue({
    router: new Router({ /* Router configuration */ }),
    store: new Vuex.Store({ /* Vuex configuration */ }), 
});
```

All this work the bootstrap will do for you

```javascript
import bootstrap from '@smoozzy/app';

bootstrap({
    router: { /* Router configuration */ },
    store: { /* Vuex configuration */ },
}).$mount('#app');
```


## Vue plugins

You can use Vue Global API via application methods. Methods have the same behaviour as Vue Global API.

```javascript
import bootstrap from '@smoozzy/app';

bootstrap()
    .component('component-name', component)
    .directive('directive-name', directive)
    .filter('filter-name', filter)
    .mixin(mixin)
    .use(plugin, { /* plugin options */ });
```
