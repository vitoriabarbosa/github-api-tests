const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

module.exports = [
    {
        files: ['**/*.js'],
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            'no-unused-vars': 'warn',
            'no-console': 'off'
        }
    }
]
