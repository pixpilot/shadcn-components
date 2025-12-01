import type { Meta, StoryObj } from '@storybook/react';
import { CloseButtonRounded } from '../src/CloseButtonRounded';

/**
 * A rounded close button with X icon.
 * Commonly used for closing dialogs, modals, or other overlay components.
 */
const meta = {
  title: 'shadcn-ui/CloseButtonRounded',
  component: CloseButtonRounded,
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
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
    },
  },
} satisfies Meta<typeof CloseButtonRounded>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rounded close button
 */
export const Default: Story = {
  args: {},
};

/**
 * Destructive variant for dangerous close actions
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

/**
 * Outline variant
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};
