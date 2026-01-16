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
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DropdownSelect: Story = {
  name: 'ThemeModeDropdown (Light/Dark/System)',
  render: () => {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DropdownWithHook />
      </ThemeProvider>
    );
  },
};

function DropdownWithHook() {
  // NOTE: This is a Storybook-specific workaround. In real apps, you can use useTheme directly.
  //
  // The problem: Storybook's global ThemeSync in Wrapper.tsx syncs the toolbar with next-themes,
  // but it only handles "light" and "dark", not "system". When you select "system" in the dropdown,
  // the toolbar doesn't understand it and forces it back to "light" or "dark".
  //
  // The solution: Keep local state for the dropdown's selection (which can be "system"),
  // and also call setTheme to update the actual theme. The local state preserves the "system"
  // selection even when the global theme changes.
  const { setTheme, resolvedTheme } = useTheme();
  const [themeSelection, setThemeSelection] = React.useState<string>('system');

  const handleThemeChange = (newTheme: string) => {
    setThemeSelection(newTheme); // Keep local state
    setTheme(newTheme); // Update global theme
  };

  return (
    <ThemeModeDropdown
      themeValue={themeSelection}
      onChange={handleThemeChange}
      value={resolvedTheme}
    />
  );
}

export const ToggleButton: Story = {
  name: 'ThemeModeToggleButton (Light/Dark)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return <ThemeModeToggleButton onChange={setTheme} value={resolvedTheme} />;
  },
};

export const SwitchIconsOutside: Story = {
  name: 'ThemeModeSwitchOutside',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return <ThemeModeSwitchOutside onChange={setTheme} value={resolvedTheme} />;
  },
};

export const SwitchIconsInside: Story = {
  name: 'ThemeModeSwitchInside',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setTheme, resolvedTheme } = useTheme();
    return <ThemeModeSwitchInside {...args} onChange={setTheme} value={resolvedTheme} />;
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
