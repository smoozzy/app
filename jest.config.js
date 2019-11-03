module.exports = {
    preset: '@vue/cli-plugin-unit-jest',

    // coverage report
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!**/node_modules/**',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['html', 'text'],
};
