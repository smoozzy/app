const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
    root: true,

    env: {
        node: true,
    },

    'extends': [
        'plugin:vue/essential',
        'eslint:recommended',
    ],

    rules: {
        'no-console': isProduction ? 'error' : 'off',
        'no-debugger': isProduction ? 'error' : 'off',
    },

    parserOptions: {
        parser: 'babel-eslint',
    },
};
