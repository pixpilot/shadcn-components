import type { Options as TsDownOptions } from 'tsdown';

const config: TsDownOptions = {
  entry: ['src/**/*.{ts,tsx}'],
  dts: true,
  // minify: true,
  clean: true,
  format: ['esm'],
  external: [
    'react',
    'react-dom',
    'class-variance-authority',
    'lucide-react',
    '@radix-ui/react-*',
  ],
};

export default config;
