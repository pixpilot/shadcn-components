import type { Preview } from '@storybook/react';
import { addAPIProvider } from '@iconify/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import React from 'react';
import { worker } from './mocks/browser';

import { Wrapper } from './Wrapper';
import './globals.css';

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
    // eslint-disable-next-line ts/explicit-module-boundary-types
    (Story) => React.createElement(Wrapper, null, React.createElement(Story)),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
};

const iconifyServer =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:6006';

// Remove the default Iconify API provider to use our custom one
// It use MSW to mock the API requests in storybook
addAPIProvider('', {
  resources: [iconifyServer],
  path: '/api/iconify/',
});

export default preview;
