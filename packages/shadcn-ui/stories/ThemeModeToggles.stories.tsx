import type { Meta, StoryObj } from '@storybook/react';

import { useTheme } from 'next-themes';
import React from 'react';

import { ThemeProvider } from '../src/theme-provider';
import {
  ThemeModeDropdown,
  ThemeModeSwitchInside,
  ThemeModeSwitchOutside,
  ThemeModeToggleButton,
} from '../src/theme-toggle';

/**
 * Theme mode toggle components - pure components that accept theme props.
 * Wrap your app (or story) with `ThemeProvider` and pass theme values via useTheme hook.
 */

const meta: Meta = {
  title: 'shadcn-ui/ThemeModeToggles',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex items-center gap-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DropdownSelect: Story = {
  name: 'ThemeModeDropdown (Light/Dark/System)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme, setTheme, resolvedTheme } = useTheme();
    return (
      <ThemeModeDropdown
        theme={theme}
        setTheme={setTheme}
        resolvedTheme={resolvedTheme}
      />
    );
  },
};

export const ToggleButton: Story = {
  name: 'ThemeModeToggleButton (Light/Dark)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return <ThemeModeToggleButton setTheme={setTheme} resolvedTheme={resolvedTheme} />;
  },
};

export const SwitchIconsOutside: Story = {
  name: 'ThemeModeSwitchOutside',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return <ThemeModeSwitchOutside setTheme={setTheme} resolvedTheme={resolvedTheme} />;
  },
};

export const SwitchIconsInside: Story = {
  name: 'ThemeModeSwitchInside',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return (
      <ThemeModeSwitchInside
        {...args}
        setTheme={setTheme}
        resolvedTheme={resolvedTheme}
      />
    );
  },
  args: {
    size: 'md',
    showIcons: true,
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle pill',
    },
    showIcons: {
      control: { type: 'boolean' },
      description: 'Show sun/moon icons',
    },
    iconSize: {
      control: { type: 'number' },
      description: 'Icon size (px)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled',
    },
  },
};
