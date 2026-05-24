import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

const packagesDir = path.resolve(__dirname, '../../packages');
const workspacePackages = fs
  .readdirSync(packagesDir)
  .filter((item) => fs.statSync(path.join(packagesDir, item)).isDirectory());

const workspaceAliases = workspacePackages.reduce<Record<string, string>>(
  (aliases, pkg) => {
    const srcPath = path.resolve(packagesDir, pkg, 'src');
    if (!fs.existsSync(srcPath)) {
      return aliases;
    }

    if (pkg === 'shadcn') {
      aliases['@pixpilot/shadcn'] = srcPath;
      return aliases;
    }

    aliases[`@pixpilot/${pkg}`] = srcPath;
    return aliases;
  },
  {
    '@': path.resolve(__dirname, '../../packages/shadcn/src'),
  },
);

const workspaceAliasPackages = Object.keys(workspaceAliases).filter((alias) =>
  alias.startsWith('@pixpilot/'),
);

export default defineConfig({
  resolve: {
    alias: workspaceAliases,
  },
  optimizeDeps: {
    // Keep workspace packages out of prebundling so HMR reflects local source edits.
    exclude: workspaceAliasPackages,
    include: ['react', 'react-dom'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
