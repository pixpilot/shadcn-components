import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button } from '../src/Button';
import { LoadingOverlay } from '../src/LoadingOverlay';

/**
 * A loading overlay component with backdrop and positioning options.
 * Shows a spinning loader over the entire screen or a container.
 */
const meta = {
  title: 'shadcn-ui/LoadingOverlay',
  component: LoadingOverlay,
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
    scope: {
      control: 'select',
      options: ['container', 'fullscreen'],
      description: 'Scope of the loader overlay',
    },
  },
} satisfies Meta<typeof LoadingOverlay>;

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

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 4000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div className="relative">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} loading={loading} />
      </div>
    );
  },
};

export const DelayedLoader: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'center',
    delay: 1000, // 1 second delay
  },
  render: function DelayedLoader(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 4000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div className="relative">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} loading={loading} />
      </div>
    );
  },
};

/**
 * Fullscreen loader overlay
 */
export const Fullscreen: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'center',
    scope: 'fullscreen',
  },
  render: function ContainerScope(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 4000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div className="relative w-64 h-64 border">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} loading={loading} />
      </div>
    );
  },
};

/**
 * Demonstrates that the loader shows immediately on mount (no fade-in) when
 * delay is 0. Click "Show Component" to mount a container whose loader is
 * active from the very first render, blocking the content instantly.
 */
export const LoadingOnMount: Story = {
  args: {
    loading: true,
    backdrop: true,
    placement: 'center',
    scope: 'container',
  },
  render: function LoadingOnMountStory(args) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleShow = () => {
      setLoading(true);
      setShow(true);
    };

    return (
      <div className="flex flex-col gap-4 items-start">
        <div className="flex gap-2">
          <Button onClick={handleShow} disabled={show}>
            Show Component
          </Button>
          {show && (
            <Button variant="outline" onClick={() => setLoading((v) => !v)}>
              {loading ? 'Stop Loading' : 'Start Loading'}
            </Button>
          )}
          {show && (
            <Button
              variant="outline"
              onClick={() => {
                setShow(false);
                setLoading(true);
              }}
            >
              Hide
            </Button>
          )}
        </div>
        {show && (
          <div className="relative w-64 h-40 border rounded-md overflow-hidden">
            <div className="p-4">
              <p className="font-medium">Component content</p>
              <p className="text-sm text-muted-foreground">
                This content is blocked immediately on mount.
              </p>
            </div>
            <LoadingOverlay {...args} loading={loading} />
          </div>
        )}
      </div>
    );
  },
};

/**
 * Fullscreen loader overlay
 */
export const ContainerScope: Story = {
  args: {
    loading: true,
    scope: 'container',
  },
  render: function ContainerScope(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 4000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div className="relative w-64 h-64 border">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} loading={loading} />
      </div>
    );
  },
};
