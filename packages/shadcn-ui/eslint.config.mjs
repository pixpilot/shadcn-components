import baseConfig from '@internal/eslint-config/react';

// Uncomment to use the internal ESLint config if available
// /** @type {import('@internal/eslint-config').Config} */
/** @type {import('typescript-eslint').Config} */
const config = Array.isArray(baseConfig)
  ? [
      ...baseConfig,
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          'custom/no-typeof-shadcn-components': 'off',
        },
      },
    ]
  : baseConfig;

export default config;
