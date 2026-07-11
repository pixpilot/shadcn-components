import type { ComponentMeta } from '@internal/mcp';
import type { ThemeProviderProps } from './ThemeProvider';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that a
// newly forwarded next-themes prop is a compile error until it is documented
// here. next-themes' ThemeProvider does not extend a native element, so `keyof`
// yields only real props.
type ThemeProviderDocumentedProps = Extract<keyof ThemeProviderProps, string>;

export const meta: ComponentMeta<ThemeProviderDocumentedProps> = {
  name: 'ThemeProvider',
  category: 'Utilities',
  description:
    'A thin wrapper around the next-themes ThemeProvider preconfigured for class-based theming with system detection.',
  props: defineProps<ThemeProviderDocumentedProps>({
    children: 'Application subtree that reads the current theme.',
    attribute: {
      description: 'How the theme is applied to the html element.',
      type: 'string | string[]',
      defaultValue: '"class"',
    },
    defaultTheme: {
      description: 'Theme used when none is stored.',
      type: 'string',
      defaultValue: '"system"',
    },
    enableSystem: {
      description: 'Whether to follow the OS color-scheme preference.',
      type: 'boolean',
      defaultValue: 'true',
    },
    storageKey: 'localStorage key used to persist the selected theme.',
    themes: 'List of available theme names.',
    forcedTheme:
      'Forces a specific theme for the subtree, ignoring stored and system preferences.',
    disableTransitionOnChange: {
      description: 'Disables CSS transitions while switching themes to avoid flashes.',
      type: 'boolean',
      defaultValue: 'false',
    },
    enableColorScheme: {
      description:
        'Whether to set the `color-scheme` style so native UI (scrollbars, inputs) matches.',
      type: 'boolean',
      defaultValue: 'true',
    },
    value: 'Mapping of theme name to the value written to the DOM attribute.',
    nonce: 'CSP nonce applied to the injected theme script.',
    scriptProps: 'Extra props spread onto the injected theme <script> tag.',
  }),
  notes: ['All other next-themes ThemeProvider props are forwarded.'],
  examples: [
    {
      title: 'Wrap the app',
      code: '<ThemeProvider>\n  <App />\n</ThemeProvider>',
    },
  ],
  related: ['ThemeModeToggleButton'],
  keywords: ['theme', 'dark mode', 'provider', 'next-themes'],
};
