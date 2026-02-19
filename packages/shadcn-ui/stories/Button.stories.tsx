import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/Button';

/**
 * A customizable button component with loading states, tooltips, and multiple variants.
 * Built on top of shadcn/ui Button component.
 */
const meta = {
  title: 'shadcn-ui/Button',
  component: Button,
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
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with primary styling
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Destructive button for dangerous actions
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

/**
 * Outline button with transparent background
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Secondary button for less prominent actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Ghost button with minimal styling
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/**
 * Link-styled button
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

/**
 * Button in loading state with spinner
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

/**
 * Small button
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

/**
 * Large button
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Disabled button
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

/**
 * Button with tooltip
 */
export const WithTooltip: Story = {
  args: {
    tooltip: 'This is a helpful tooltip',
    children: 'Hover me',
  },
};

/**
 * Disabled button with tooltip explaining why
 */
export const DisabledWithTooltip: Story = {
  args: {
    disabled: true,
    disabledTooltip: 'This action is not available right now',
    children: 'Disabled with tooltip',
  },
};

/**
 * Disabled button with tooltip and disabled overlay click handler
 */
export const DisabledClickableOverlay: Story = {
  args: {
    disabled: true,
    disabledTooltip: 'Disabled reason line 1\nMore details here',
    children: 'Disabled (click overlay)',
  },
};

/**
 * Multiline string tooltip — should split into paragraphs on newlines
 */
export const MultilineStringTooltip: Story = {
  args: {
    tooltip: 'First line\nSecond line\nThird line',
    children: 'Multiline tooltip',
  },
};

/**
 * Tooltip provided as a React node
 */
export const TooltipWithNode: Story = {
  render: (args) => (
    <Button
      {...args}
      tooltip={
        <>
          <strong>Rich title</strong>
          <p className="mt-1">Additional descriptive text as a node.</p>
        </>
      }
    >
      Tooltip node
    </Button>
  ),
};
