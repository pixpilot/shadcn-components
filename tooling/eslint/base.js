import makeConfig from '@pixpilot/eslint-config';

/**
 * @type {ReturnType<typeof makeConfig>}
 */
const baseConfig = makeConfig({
  pnpm: false,
  turbo: true,
});

// eslint-disable-next-line antfu/no-top-level-await
export default await baseConfig;
