# Smoozzy App

This project is a bootstrap for Vue aplications. It's similar to `createApp` from Vue 3 (see proposal [Global mounting/configuration API change](https://github.com/vuejs/rfcs/pull/29)).

The bootstrap creates a Vue application with the following plugins and extensions:

- [router](#Router)
- [store](#Store)

## Todo

- [ ] i18n
  - [ ] simple use case
  - [ ] loading of translations
- [ ] modals
  - [ ] manager
  - [ ] component
- [ ] modules system
- [x] router
- [x] store


## User guide

### Basic application

```js
import bootstrap from '@smoozzy/app';

bootstrap().$mount('#app');
```

### Hello world

> Note: This example bases on Vue Hello World application. We update couple of files.

```js
// ---
// file: @/router.js

import App from './App.vue';
import Home from './views/Home.vue';

// export routes configuration
// `App` is module of the our application
export default [{
    name: 'hello-world',
    path: '/',
    component: App,
    children: [{
        name: 'home',
        path: '',  // default route
        component: Home,
    }, {
        name: 'about',
        path: '/about',
        component: () => import(/* webpackChunkName: 'about' */ './views/About.vue'),
    }],
}]


// ---
// file: @/main.js

import bootstrap from '@smoozzy/app';
import routes from './router';

bootstrap({
    router: {
        routes,
    }
}).$mount('#app');
```


## Plugins

### Router

The bootstrap uses the official [Vue router](http://router.vuejs.org/) ([Github](https://github.com/vuejs/vue-router)).

### Store

The bootstrap uses [Vuex](https://vuex.vuejs.org) ([Github](https://github.com/vuejs/vuex)) for centralized state management of the application.


## Bootstrap from scratch

If you like our bootstrap, but you want to remove some plugin, you can write your own application bootstrap. Under the hood, our bootstrap does the following magic:

```js
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import SBootstrap from '@smoozzy/app/src/components/bootstrap';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(Vuex);


// init plugins
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    // ... your router options
});

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production'
    // ... your vuex options
});

sync(store, router);

// create Vue application
new Vue({
    router,
    store,
    render: h => h(SBootstrap),
});
```


## Development

⚠️ We use [Yarn](https://yarnpkg.com) as package manager for development. Because it does holy magic and we can run tests without pain (see explanation in [Testing](#Testing) section).

__Project setup:__

```bash
yarn install

# or in CI environment
yarn install --frozen-lockfile
```

__Lints and fixes files:__

```bash
yarn lint

# if you want to fix sources
yarn lint:fix
```

__Run unit tests:__

```bash
yarn test

# or (the same result)
yarn test:unit
```

__Updating dependencies:__

Check outdating dependencies

```bash
yarn outdated

# or
npx npm-check-updates
```

After updating of dependencies in `package.json`

```bash
yarn upgrade
```


## Testing

We use [Jest](https://jestjs.io) and [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest) for running unit tests.

### Coverage report

To get coverage report run command:

```bash
yarn test:unit --coverage
```

Report will be placed in directory `coverage`

### Error

You should also use Yarn as package Manager to install dependencies. Because it deduplicates node modules in a certain way so that our ES6 code uses "require" instead of "import". And so we can run our tests without errors.

See related issues:

- [Vue CLI: Jest tests can't process import statement](https://github.com/vuejs/vue-cli/issues/1584)
- [Vue CLI: Default unit tests are failing](https://github.com/vuejs/vue-cli/issues/1879) (Food for thought)
- [Jest: Requires Babel "^7.0.0-0", but was loaded with "6.26.3"](https://github.com/facebook/jest/issues/6913) (Closed)

❗️ If you still get error similar to [Vue CLI: Jest tests can't process import statement](https://github.com/vuejs/vue-cli/issues/1584) as first solution try to clear Jest's cache.

```bash
node node_modules/.bin/jest --clearCache
```

