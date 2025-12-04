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
    dts: true,
    clean: true,
    format: ['esm', 'cjs'],
    unbundle: true,
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime', // Add this - critical!
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'date-fns',
      /^@radix-ui\//u, // Use regex pattern for better matching
    ],
    // Ensure proper treeshaking and no Node.js polyfills
    treeshake: true,
    platform: 'browser',
    // sourcemap: true,
    ...options,
  });
}

export default defineConfig;
