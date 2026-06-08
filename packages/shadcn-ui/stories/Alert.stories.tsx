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
      control: 'object',
      description: 'Alert description (string or React node)',
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

/**
 * Alert with multiline description
 */
export const MultilineDescription: Story = {
  args: {
    variant: 'info',
    title: 'Multiline Alert',
    description:
      'This is the first line.\nThis is the second line.\nAnd this is the third line.',
  },
};

/**
 * Alert with React component in description
 */
export const DescriptionWithComponent: Story = {
  args: {
    variant: 'warning',
    title: 'Component in Description',
    description: (
      <div id="alert-div-1">
        This alert contains a{' '}
        <a id="alert-a-1" href="https://example.com" className="underline">
          link
        </a>{' '}
        and some <strong id="alert-strong-1">bold text</strong>.
      </div>
    ),
  },
};

/**
 * Alert with children only (no `title` or `description` props)
 */
export const ChildrenOnly: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <div id="alert-div-2">
          <strong id="alert-strong-2">Custom content:</strong> This alert is rendered via
          children only.
        </div>
        <div id="alert-div-3">
          <strong id="alert-strong-3">Custom content:</strong> This alert is rendered via
          children only.
        </div>
      </>
    ),
  },
};

export const ChildrenWithIconOnly: Story = {
  args: {
    variant: 'info',
    icon: true,
    children: (
      <div id="alert-div-4">
        <strong id="alert-strong-4">Icon child content:</strong> Children render inside
        the text column beside the icon.
      </div>
    ),
  },
};

export const WithTitleAndChildren: Story = {
  args: {
    variant: 'success',
    title: 'Alert with Title and Children',
    children: (
      <div id="alert-div-5">
        This child content appears inside the structured text column below the title.
      </div>
    ),
  },
};

export const WithDescriptionAndChildren: Story = {
  args: {
    variant: 'warning',
    description: 'This alert has a description and child content without an icon.',
    children: (
      <div id="alert-div-6">
        This child content appears below the description in the same column.
      </div>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'info',
    title: 'Alert with Icon',
    description: 'This alert includes an icon by default.',
    icon: true,
  },
};

export const WithTitleAndIconAndChildren: Story = {
  args: {
    variant: 'default',
    title: 'Alert with Title, Icon, and Children',
    description: 'This alert includes a title, an icon, and custom children content.',
    icon: true,
    children: (
      <div id="alert-div-7" className="text-red-500">
        This content is rendered via children and appears below the title and description.
      </div>
    ),
  },
};
