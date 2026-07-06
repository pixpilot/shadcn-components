import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../src/button';
import { LoadingOverlay } from '../src/loading-overlay';

const AUTO_HIDE_DELAY = 4000;
const OUT_DELAY_AUTO_HIDE_DELAY = 2500;
const OUT_DELAY = 1500;

type StoryArgs = Partial<
  ComponentProps<typeof LoadingOverlay> & {
    id?: string;
  }
>;

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
    show: {
      control: 'boolean',
      description: 'Whether the loader is visible',
    },
    inDelay: {
      control: 'number',
      description: 'Delay in milliseconds before showing the loader',
    },
    outDelay: {
      control: 'number',
      description: 'Delay in milliseconds before hiding the loader',
    },
    scope: {
      control: 'select',
      options: ['container', 'fullscreen'],
      description: 'Scope of the loader overlay',
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loader with backdrop
 */
export const Default: Story = {
  args: {
    show: true,
    backdrop: true,
    placement: 'center',
  },
};

/**
 * Loader without backdrop
 */
export const WithoutBackdrop: Story = {
  args: {
    show: true,
    backdrop: false,
    placement: 'center',
  },
};

/**
 * Loader positioned at top
 */
export const TopPlacement: Story = {
  args: {
    show: true,
    backdrop: true,
    placement: 'top',
  },
};

/**
 * Loader positioned at bottom
 */
export const BottomPlacement: Story = {
  args: {
    show: true,
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
    show: false, // Will be controlled by state
  },
  render: function InteractiveLoader(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div id="loading-overlay-div-1" className="relative">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} show={loading} />
      </div>
    );
  },
};

export const DelayedLoader: Story = {
  args: {
    show: true,
    backdrop: true,
    placement: 'center',
    inDelay: 1000, // 1 second delay
  },
  render: function DelayedLoader(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div id="loading-overlay-div-2" className="relative">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} show={loading} />
      </div>
    );
  },
};

export const OutDelayedLoader: Story = {
  args: {
    show: true,
    backdrop: true,
    placement: 'center',
    outDelay: OUT_DELAY,
    message: 'Finishing up...',
  },
  render: function OutDelayedLoader(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, OUT_DELAY_AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div
        id="loading-overlay-div-out-delay"
        className="relative w-64 h-40 border rounded-md overflow-hidden"
      >
        <div className="p-4">
          <Button onClick={() => setLoading(!loading)}>
            {loading ? 'Stop Loading' : 'Start Loading'}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            The overlay remains visible briefly after loading stops.
          </p>
        </div>
        <LoadingOverlay {...args} show={loading} />
      </div>
    );
  },
};

/**
 * Fullscreen loader overlay
 */
export const Fullscreen: Story = {
  args: {
    show: true,
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
      }, AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div id="loading-overlay-div-3" className="relative w-64 h-64 border">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} show={loading} />
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
    show: true,
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
      <div id="loading-overlay-div-4" className="flex flex-col gap-4 items-start">
        <div id="loading-overlay-div-5" className="flex gap-2">
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
          <div
            id="loading-overlay-div-6"
            className="relative w-64 h-40 border rounded-md overflow-hidden"
          >
            <div id="loading-overlay-div-7" className="p-4">
              <p id="loading-overlay-p-1" className="font-medium">
                Component content
              </p>
              <p id="loading-overlay-p-2" className="text-sm text-muted-foreground">
                This content is blocked immediately on mount.
              </p>
            </div>
            <LoadingOverlay {...args} show={loading} />
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
    show: true,
    scope: 'container',
  },
  render: function ContainerScope(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div id="loading-overlay-div-8" className="relative w-64 h-64 border">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <LoadingOverlay {...args} show={loading} />
      </div>
    );
  },
};
