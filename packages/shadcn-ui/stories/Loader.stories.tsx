import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../src/Button';
import { Loader } from '../src/Loader';

/**
 * A loading overlay component with backdrop and positioning options.
 * Shows a spinning loader over the entire screen or a container.
 */
const meta = {
  title: 'shadcn-ui/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A full-screen loading overlay with customizable positioning and backdrop.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backdrop: {
      control: 'boolean',
      description: 'Whether to show a dark backdrop',
    },
    placement: {
      control: 'select',
      options: ['top', 'center', 'bottom'],
      description: 'Position of the loader on screen',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the loader is visible',
    },
    delay: {
      control: 'number',
      description: 'Delay in milliseconds before showing the loader',
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loader with backdrop
 */
export const Default: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'center',
  },
};

/**
 * Loader without backdrop
 */
export const WithoutBackdrop: Story = {
  args: {
    loading: true,
    backdrop: false,
    placement: 'center',
  },
};

/**
 * Loader positioned at top
 */
export const TopPlacement: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'top',
  },
};

/**
 * Loader positioned at bottom
 */
export const BottomPlacement: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'bottom',
  },
};

/**
 * Interactive loader with toggle button
 */
export const Interactive: Story = {
  args: {
    backdrop: true,
    placement: 'center',
    loading: false, // Will be controlled by state
  },
  render: function InteractiveLoader(args) {
    const [loading, setLoading] = useState(false);

    return (
      <div className="relative">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <Loader {...args} loading={loading} />
      </div>
    );
  },
};
