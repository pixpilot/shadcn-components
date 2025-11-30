import reactConfig from '@internal/eslint-config/react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

/** @type {import('typescript-eslint').Config} */
const config = [
  ...reactConfig,
  {
    ignores: ['dist/**', 'index.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      'ts/no-use-before-define': 'warn',
      'ts/strict-boolean-expressions': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'react/no-context-provider': 'off',
      'perfectionist/sort-imports': 'off',
      'no-underscore-dangle': 'warn',
      'no-nested-ternary': 'warn',
      'react/no-nested-component-definitions': 'warn',
      'perfectionist/sort-named-exports': 'warn',
      'ts/no-shadow': 'warn',
    },
  },
];

export default config;
