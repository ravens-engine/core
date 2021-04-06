/* eslint-env node */

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        // Allow unused variables to be prefixed by `_` so that they
        // are ignored by eslint
        "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}],
        // "object" is supposed to be hard to use in Typescript, but I've
        // never ran into any issue, so allow them
        "@typescript-eslint/ban-types": ["off"],
        // Since [Map].get can always return undefined, even if the presence
        // of the key was checked, `!` is used multiple times in the project,
        // which provokes no-non-null-assertion. Let's disable them
        "@typescript-eslint/no-non-null-assertion": ["off"],
    },
};