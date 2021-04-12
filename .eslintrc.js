module.exports = {
    extends: 'airbnb',
    env: {
        node: true,
        browser: false,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4],
        'no-console': 0,
    },
};
