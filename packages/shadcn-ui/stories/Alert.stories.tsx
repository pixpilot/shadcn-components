import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../src/Alert';

/**
 * Alert component for displaying important messages to users.
 * Supports multiple variants for different message types.
 */
const meta = {
  title: 'shadcn-ui/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'warning', 'info', 'success'],
      description: 'Visual style indicating message type',
    },
    title: {
      control: 'text',
      description: 'Alert title',
    },
    description: {
      control: 'text',
      description: 'Alert description',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert with neutral styling
 */
export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Heads up!',
    description: 'You can add components to your app using the cli.',
  },
};

/**
 * Error alert for critical messages
 */
export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'Something went wrong. Please try again later.',
  },
};

/**
 * Warning alert for cautionary messages
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'This action may have unintended consequences.',
  },
};

/**
 * Info alert for informational messages
 */
export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'Here is some helpful information about this feature.',
  },
};

/**
 * Success alert for positive feedback
 */
export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    description: 'Your changes have been saved successfully.',
  },
};

/**
 * Alert with title only
 */
export const TitleOnly: Story = {
  args: {
    variant: 'info',
    title: 'Quick message',
  },
};

/**
 * Alert with description only
 */
export const DescriptionOnly: Story = {
  args: {
    variant: 'default',
    description: 'This is a simple alert without a title.',
  },
};

/**
 * Custom styled alert
 */
export const CustomStyle: Story = {
  args: {
    variant: 'success',
    title: 'Custom Alert',
    description: 'This alert has custom styling applied.',
    className: 'border-2 shadow-lg',
  },
};
