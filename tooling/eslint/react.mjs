import reactConfig from '@pixpilot/eslint-config-react';
import commonConfig from './common.mjs';

// eslint-disable-next-line antfu/no-top-level-await
const eslintConfig = await reactConfig({}, ...commonConfig);

export default eslintConfig;
