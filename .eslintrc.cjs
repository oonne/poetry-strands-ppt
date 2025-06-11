const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'prettier',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.css', 'vue'],
      },
      alias: {
        map: [
          ['@', path.resolve(__dirname, './src')],
        ],
        extensions: ['.ts', '.tsx'], // 可忽略的后缀名
      },
    },
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
      ts: 'never',
      tsx: 'never',
      vue: 'never',
    }],
    'import/prefer-default-export': 'off',
    'vue/multi-word-component-names': ['error', {
      ignores: [
        'index',
      ],
    }],
    'no-bitwise': 'off',
    'no-mixed-operators': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': ['warn', { code: 100 }],
  },
};
