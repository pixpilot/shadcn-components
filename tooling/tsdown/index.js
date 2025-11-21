import { defineConfig as defineTsDownConfig } from '@pixpilot/tsdown-config';

const KB = 1024;
const LIMIT = 200;
const LIMIT_KB = LIMIT * KB;

/**
 * @param {import('@pixpilot/tsdown-config').Options} options
 */
export function defineConfig(options) {
  return defineTsDownConfig({
    minify: true,
    bundleSize: LIMIT_KB,
    // sourcemap: true,
    ...options,
  });
}

export default defineConfig;
