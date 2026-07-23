import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  // Collect stories from all packages' stories folders
  stories: [
    '../../../packages/*/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/*/stories/**/*.mdx',
  ],
  addons: [
    // '@storybook/addon-links',
    '@storybook/addon-essentials/controls',
    // '@storybook/addon-interactions',
    '@storybook/addon-themes',
    'storybook-addon-playwright/register',
  ],
  staticDirs: ['public'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: path.resolve(__dirname, '../vite.config.ts'),
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/u.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
