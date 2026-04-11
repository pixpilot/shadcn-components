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
          'react/no-forward-ref': 'off',
        },
      },
      {
        /*
         * Markdown virtual code blocks (e.g. README.md/0_0.tsx) match *.tsx
         * but have no TypeScript project info, so type-aware rules crash.
         * Disable them for all markdown-embedded files.
         */
        files: ['**/*.md/**'],
        rules: {
          'ts-no-autofix/promise-function-async': 'off',
          'ts/promise-function-async': 'off',
        },
      },
    ]
  : baseConfig;

export default config;
