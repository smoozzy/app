# Smoozzy App

This project is a bootstrap for Vue applications. It's similar to `createApp` from Vue 3 (see proposal [Global mounting/configuration API change](https://github.com/vuejs/rfcs/pull/29)).

The bootstrap creates a Vue application with the following plugins and extensions:

- [Vue Router](http://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org)


## Basic application example

```javascript
import bootstrap from '@smoozzy/app';

bootstrap({
    router: { /* Router configuration */ },
    store: { /* Vuex configuration */ },
}).$mount('#app');
```


## Documentation

You can read detailed [documentation](./docs/index.md)

1. [Overview](./docs/01-overview.md)
2. [Vue plugins](./docs/02-vue-plugins.md)
3. [Modules](./docs/03-modules.md)
4. Modals
5. I18n
6. Example
7. [Bootstrap from scratch](./docs/07-from-scratch.md)
8. [Development guide](./docs/08-development.md)


## Issues

If you found bug or unexpected behavior feel free to [report issue](../../issues)


## Changelog

Detailed changes for each release are documented in the [release notes](./CHANGELOG.md)


## Development

Please read [development guide](./docs/08-development.md)


## License

[MIT](http://opensource.org/licenses/MIT)

