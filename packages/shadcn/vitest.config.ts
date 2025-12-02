import path from 'node:path';
import { mergeConfig } from 'vitest/config';
import baseConfig from '@internal/vitest-config';

export default mergeConfig(baseConfig, {
  test: {
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
