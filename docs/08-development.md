# Development

## Workflow

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

Check outdated dependencies

```bash
yarn outdated

# or
npx npm-check-updates
```


## Testing

We use [Jest](https://jestjs.io) and [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest) for running unit tests.


```bash
# run unit tests with coverage report
yarn test:unit
```

```bash
# watch mode for a tests running
yarn test:unit --watch
```

Coverage report you can find in `<root>/coverage` directory.


## Debugging

Run following command if you want to check how does tests run:

```bash
# clear jest cache
node node_modules/.bin/jest --clearCache

# run tests
node --inspect-brk node_modules/.bin/vue-cli-service test:unit --runInBand
```

### Import statement error 

You should also use Yarn as package Manager to install dependencies. Because it deduplicates node modules in a certain way so that our ES6 code uses "require" instead of "import". And so we can run our tests without errors.

See related issues:

- [Vue CLI: Jest tests can't process import statement](https://github.com/vuejs/vue-cli/issues/1584)
- [Vue CLI: Default unit tests are failing](https://github.com/vuejs/vue-cli/issues/1879) (Food for thought)
- [Jest: Requires Babel "^7.0.0-0", but was loaded with "6.26.3"](https://github.com/facebook/jest/issues/6913) (Closed)

❗️ If you still get error similar to [Vue CLI: Jest tests can't process import statement](https://github.com/vuejs/vue-cli/issues/1584) as first solution try to clear Jest's cache.

```bash
node node_modules/.bin/jest --clearCache
```
