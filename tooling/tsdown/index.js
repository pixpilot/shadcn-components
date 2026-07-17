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
    // `neutral` keeps `process.env.NODE_ENV` intact in the output so each
    // consumer's bundler (Next.js, Vite, etc.) can dead-code-eliminate dev-only
    // guards in production. `browser` would inline it to "development" at our
    // build time, making dev-only code run unconditionally in shipped bundles.
    platform: 'neutral',
    // sourcemap: true,
    ...options,
  });
}

export default defineConfig;
