## [0.6.0](https://github.com/smoozzy/app/compare/v0.5.0...v0.6.0) (2020-02-25)

### Features

* combined `Root` and `SBootstrap` components into single node

### Bugfixes

* fixed order of plug-ins initialization
* fixed overriding of applicetion methods by methods from application options


## [0.5.0](https://github.com/smoozzy/app/compare/v0.4.2...v0.5.0) (2019-09-12)

### Features

* vue loader is not required for transpile the bootstrap component anymore
* modules system was rewritten from scratch
* unregister functionality of module was dropped

### Bugfixes

* fixed access from module's mutation and action to root's methods (flag `options.root`)


## [0.4.2](https://github.com/smoozzy/app/compare/v0.4.1...v0.4.2) (2019-09-05)

### Bugfixes

* fixed initialization of dynamically loaded module


## [0.4.1](https://github.com/smoozzy/app/compare/v0.4.0...v0.4.1) (2019-08-23)

### Features

* can omit "path" property for default child route

### Bugfixes

* fixed router navigation after adding new modules on application setup if router guard freezed navigation
* fixed raising of error in store (strict mode) on mutation in submodule


## [0.4.0](https://github.com/smoozzy/app/compare/v0.3.0...v0.4.0) (2019-08-13)

### Features

* added modules system


## [0.3.0](https://github.com/smoozzy/app/compare/v0.2.0...v0.3.0) (2019-05-21)

### Features

* added wrappers for Vue Global API


## [0.2.0](https://github.com/smoozzy/app/compare/v0.1.0...v0.2.0) (2019-05-15)

### Features

* setting of user instance of router and vuex in application options


## 0.1.0 (2019-05-14)

Initial release

### Features

* creating of Vue application with router and Vuex
