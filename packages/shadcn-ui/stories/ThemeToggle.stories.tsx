import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../src/theme-provider';
import { ThemeToggle } from '../src/ThemeToggle';

/**
 * A theme toggle button that cycles through light, dark, and system themes.
 * Requires ThemeProvider context to function properly.
 */
const meta = {
  title: 'shadcn-ui/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Theme toggle button with theme provider
 */
export const Default: Story = {
  render: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeToggle />
    </ThemeProvider>
  ),
};
