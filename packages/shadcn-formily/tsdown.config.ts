import { defineConfig } from '@internal/tsdown-config';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  minify: false,
  clean: true,
  format: ['esm', 'cjs'],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@formily/core',
    '@formily/react',
    '@formily/reactive',
    '@formily/shared',
    '@pixpilot/shadcn',
    'lucide-react',
  ],
});
