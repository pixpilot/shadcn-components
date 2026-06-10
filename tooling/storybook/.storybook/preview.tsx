import type { Decorator, Preview } from '@storybook/react';
import { addAPIProvider } from '@iconify/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { useEffect } from 'react';
import { worker } from './mocks/browser';
import { STORYBOOK_ORIGIN } from './storybook-config';
import './globals.css';

function PlaywrightStylesSync() {
  useEffect(() => {
    if (navigator.webdriver !== true) {
      return () => {
        // no-op
      };
    }

    const { documentElement } = document;
    documentElement.classList.add('playwright');

    return () => {
      documentElement.classList.remove('playwright');
    };
  }, []);

  return null;
}

const withPlaywrightStyles: Decorator = (Story) => {
  return (
    <>
      <PlaywrightStylesSync />
      <Story />
    </>
  );
};

const withStoryId: Decorator = (Story, context) => {
  return (
    <div id={context.id}>
      <Story />
    </div>
  );
};

const withComponentId: Decorator = (Story, context) => {
  const args = context.args as { id?: string };

  if (context.component !== undefined && args.id == null) {
    args.id = context.id;
  }

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?<temp1>background|color)$/iu,
        date: /Date$/iu,
      },
    },
  },
  decorators: [
    withPlaywrightStyles,
    withComponentId,
    withStoryId,
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
};

// Start MSW worker
if (typeof window !== 'undefined') {
  worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .catch((error: Error) => {
      console.error('Failed to start MSW worker:', error);
    });
}

const iconifyServer =
  typeof window !== 'undefined' ? window.location.origin : STORYBOOK_ORIGIN;

// Remove the default Iconify API provider to use our custom one
// It use MSW to mock the API requests in storybook
addAPIProvider('', {
  resources: [iconifyServer],
  path: '/api/iconify/',
});

export default preview;
