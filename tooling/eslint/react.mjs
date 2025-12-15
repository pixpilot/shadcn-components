import reactConfig from '@pixpilot/eslint-config-react';
import commonConfig from './common.mjs';

// eslint-disable-next-line antfu/no-top-level-await
const baseEslintConfig = await reactConfig({}, ...commonConfig);

// Get custom plugin config
const customPluginConfig = commonConfig.find((c) => c.plugins?.custom);

// Ensure custom plugin is registered
const configArray = Array.isArray(baseEslintConfig)
  ? baseEslintConfig
  : [baseEslintConfig];

if (customPluginConfig) {
  // Check if plugin is already there
  const hasPlugin = configArray.some((c) => c.plugins?.custom);
  if (!hasPlugin) {
    configArray.unshift(customPluginConfig);
  }
}

export default configArray;
