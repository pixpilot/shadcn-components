import { defineConfig } from '@internal/tsdown-config';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  minify: false, // Disable minification to prevent template literal require() calls
  clean: true,
  format: ['esm', 'cjs'],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@pixpilot/shadcn',
    'next-themes',
    'lucide-react',
    '@ebay/nice-modal-react',
    '@iconify/react',
    '@tiptap/core',
    '@tiptap/react',
    '@tiptap/starter-kit',
    'sonner',
  ],
});
