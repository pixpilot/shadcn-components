import { defineConfig } from '@internal/tsdown-config';

const KB = 1024;
const MAX_BUNDLE_SIZE_KB = 20;

export default defineConfig({
  bundleSize: MAX_BUNDLE_SIZE_KB * KB,
  entry: 'src/index.ts',
  dts: true,
  minify: true,
});
