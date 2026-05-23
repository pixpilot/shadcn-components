import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { isEmptyObject } from '@pixpilot/object';
import { generateText } from 'ai';
import { internalIpV4 } from 'internal-ip';
import * as playwright from 'playwright';
import { createScreenshotTitlePrompt } from 'storybook-addon-playwright/ai';
import { setConfig } from 'storybook-addon-playwright/configs';
import middleware from 'storybook-addon-playwright/middleware';
import { BrowserManager } from 'storybook-addon-playwright/utils';
import { STORYBOOK_PORT } from './storybook-config.js';

const manager = new BrowserManager({
  browserCount: {
    chromium: 8,
    firefox: 4,
    webkit: 4,
  },
  createBrowser: async (browserType) => {
    const browserTypes = {
      chromium: playwright.chromium,
      firefox: playwright.firefox,
      webkit: playwright.webkit,
    };
    const wsEndpoint = `${'ws://127.0.0.1:3010'}/${browserType}`;
    return await browserTypes[browserType].connect(wsEndpoint);
  },
  isBrowserConnected: (browser) => browser.isConnected(),
});

const provider = createOpenRouter({
  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * @typedef {'chromium' | 'firefox' | 'webkit'} BrowserType
 */

(async () => {
  /**
   * @param {BrowserType} browserType
   */

  const ip = await internalIpV4();

  const strorybookEndpoint = `http://${ip}:${STORYBOOK_PORT}`;

  setConfig({
    // When running Playwright in a separate container or remote environment,
    // set `storybookEndpoint` to a host/IP that is reachable from the remote browser runtime.
    // `localhost` only works when Storybook and Playwright run on the same machine/network namespace.
    storybookEndpoint: strorybookEndpoint,
    selectorAttributeNames: ['id', 'data-testid', 'data-slot'],
    getPage: async (browserType, options) => {
      const { browser, index } = await manager.getBrowser(browserType);
      // eslint-disable-next-line no-console
      console.log(`Browser ${browserType}-${index}`);
      const page = await browser.newPage(options);
      return page;
    },

    afterScreenshot: async (page) => {
      await page.close();
    },
    getScreenshotTitle: async (context) => {
      const { story } = context;

      if (isEmptyObject(story.changedArgs || {}) && isEmptyObject(story.actions || {})) {
        return 'Should render correctly';
      }

      const { browser, ...rest } = context;

      const titlePrompt = createScreenshotTitlePrompt(rest, { maxTitleLength: 200 });

      const modeName = 'qwen/qwen3-next-80b-a3b-instruct';
      const model = provider.chat(modeName);

      const data = await generateText({
        model,
        prompt: titlePrompt.trim(),
      });

      return data.text;
    },
  });
})();

export default middleware;
