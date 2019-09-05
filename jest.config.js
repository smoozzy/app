module.exports = {
    // tests, modules and aliases
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],

    testURL: 'http://localhost/',

    // transformers
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/',
    ],

    // snapshots
    snapshotSerializers: [
        'jest-serializer-vue',
    ],

    // coverage
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!**/node_modules/**',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['html', 'text'],

    // watcher
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};
