import baseConfig from '@internal/eslint-config/react';

// Uncomment to use the internal ESLint config if available
// /** @type {import('@internal/eslint-config').Config} */
/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  {
    files: ['README.md/*.tsx'],
    rules: {
      'ts-no-autofix/promise-function-async': 'off',
    },
  },
];
