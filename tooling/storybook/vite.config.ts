import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    alias: (() => {
      const aliases: Record<string, string> = {
        '@': path.resolve(__dirname, '../../packages/shadcn/src'),
      };
      const packagesDir = path.resolve(__dirname, '../../packages');
      const packages = fs
        .readdirSync(packagesDir)
        .filter((item) => fs.statSync(path.join(packagesDir, item)).isDirectory());
      for (const pkg of packages) {
        const srcPath = path.resolve(packagesDir, pkg, 'src');
        if (fs.existsSync(srcPath)) {
          if (pkg === 'shadcn') {
            aliases['@internal/shadcn'] = srcPath;
          } else {
            aliases[`@pixpilot/${pkg}`] = srcPath;
          }
        }
      }
      return aliases;
    })(),
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
