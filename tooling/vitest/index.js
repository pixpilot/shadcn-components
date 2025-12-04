import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import defineConfig from '@pixpilot/dev-config/vitest';
import { mergeConfig } from 'vitest/config';

const dir = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(defineConfig(), {
  resolve: {
    alias: {
      '@': resolve(dir, '../../packages/shadcn/src'),
    },
  },
});
