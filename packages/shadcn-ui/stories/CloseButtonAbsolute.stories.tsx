import type { Meta, StoryObj } from '@storybook/react';
import { CloseButtonAbsolute } from '../src/CloseButtonAbsolute';

/**
 * An absolutely positioned rounded close button.
 * Positioned at top-right corner, commonly used in popovers, dialogs, or cards.
 */
const meta = {
  title: 'shadcn-ui/CloseButtonAbsolute',
  component: CloseButtonAbsolute,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
  },
} satisfies Meta<typeof CloseButtonAbsolute>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default absolutely positioned close button
 */
export const Default: Story = {
  render: () => (
    <div className="relative w-64 h-32 bg-gray-100 border rounded p-4">
      <p>Content area with close button in top-right corner</p>
      <CloseButtonAbsolute />
    </div>
  ),
};

/**
 * Destructive variant
 */
export const Destructive: Story = {
  render: () => (
    <div className="relative w-64 h-32 bg-red-50 border border-red-200 rounded p-4">
      <p>Error dialog content</p>
      <CloseButtonAbsolute variant="destructive" />
    </div>
  ),
};
