/*
 * This config file exists to prevent the VS Code ESLint extension
 * from searching for an ESLint config in the root folder.
 */

import baseConfig from './tooling/eslint/base.js';

/** @type {import('typescript-eslint').Config} */
export default baseConfig;
