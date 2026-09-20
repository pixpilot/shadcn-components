import { defineConfig } from '@internal/tsdown-config';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  minify: false,
  clean: true,
  // Keep `process.env.NODE_ENV` intact in the output so each consumer's bundler
  // (Next.js, Vite, etc.) can dead-code-eliminate dev-only guards in production.
  // A `browser` platform would inline it at build time, making dev-only code run
  // unconditionally in shipped bundles.
  platform: 'neutral',
});
