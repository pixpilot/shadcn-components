import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import React from 'react';
import { Wrapper } from './Wrapper';

import './globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?<temp1>background|color)$/iu,
        date: /Date$/iu,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
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

export default preview;
