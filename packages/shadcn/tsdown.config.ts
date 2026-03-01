import { defineConfig } from '@internal/tsdown-config';

export default defineConfig({
  entry: ['src/index.ts', 'src/form/index.ts'],
  dts: true,
  minify: false,
  clean: true,
  format: ['esm'],
});
