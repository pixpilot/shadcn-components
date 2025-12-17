import type { Meta, StoryObj } from '@storybook/react';
import { CircleLoader } from '../src/circle-loader';

/**
 * A customizable SVG spinner component with various sizes, colors, and animation speeds.
 * Supports single color or color-changing animations.
 */
const meta = {
  title: 'shadcn-ui/CircleLoader',
  component: CircleLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Preset size of the spinner',
    },
    speed: {
      control: 'number',
      description: 'Duration of rotation animation in seconds',
    },
    color: {
      control: 'color',
      description: 'Single color for the spinner',
    },
    strokeWidth: {
      control: 'number',
      description: 'Width of the spinner stroke in pixels',
    },
  },
} satisfies Meta<typeof CircleLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default medium spinner
 */
export const Default: Story = {
  args: {
    size: 'md',
  },
};

/**
 * Small spinner
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Large spinner
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

/**
 * Extra large spinner
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

/**
 * Custom color spinner
 */
export const CustomColor: Story = {
  args: {
    size: 'md',
    color: '#3b82f6',
  },
};

/**
 * Fast spinning spinner
 */
export const Fast: Story = {
  args: {
    size: 'md',
    speed: 0.5,
  },
};

/**
 * Slow spinning spinner
 */
export const Slow: Story = {
  args: {
    size: 'md',
    speed: 4,
  },
};

/**
 * Custom stroke width
 */
export const ThickStroke: Story = {
  args: {
    size: 'md',
    strokeWidth: 6,
  },
};
