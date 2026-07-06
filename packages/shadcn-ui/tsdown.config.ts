import { defineConfig } from '@internal/tsdown-config';

export default [
  defineConfig({
    entry: 'src/index.ts',
    dts: true,
    minify: false,
    clean: true,
    format: ['esm', 'cjs'],
  }),
  defineConfig({
    entry: 'src/mcp-server.ts',
    dts: false,
    minify: false,
    clean: false,
    format: ['esm'],
    platform: 'node',
  }),
];
