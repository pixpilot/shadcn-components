import reactConfig from '@internal/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  // Code fences in the docs are illustrative snippets, not compiled sources, so
  // the type-aware rules have no program to resolve them against.
  { ignores: ['**/*.md/**'] },
  ...reactConfig,
];
