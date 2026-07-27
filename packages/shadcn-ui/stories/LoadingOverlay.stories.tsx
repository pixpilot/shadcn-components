import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../src/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../src/drawer';
import { LoadingOverlay } from '../src/loading-overlay';

const AUTO_HIDE_DELAY = 4000;
const OUT_DELAY_AUTO_HIDE_DELAY = 2500;
const OUT_DELAY = 1500;
const DRAWER_LOADING_DURATION = 5000;

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
      options: ['auto', 'container', 'fullscreen'],
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
 * Fullscreen loader over content that is taller than the viewport.
 * The story wrapper creates document-level scrolling for the overlay.
 */
export const WithLongPageContent: Story = {
  args: {
    backdrop: true,
    placement: 'center',
    scope: 'fullscreen',
    show: false,
  },
  render: function LongPageContent(args) {
    const [loading, setLoading] = useState(false);

    return (
      <div id="loading-overlay-long-page" className="min-h-[160vh] w-full p-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4 border-b pb-6">
            <div>
              <h2 className="text-lg font-semibold">Long page content</h2>
              <p className="text-sm text-muted-foreground">
                Scroll the page while the fullscreen loader is active.
              </p>
            </div>
            <Button onClick={() => setLoading((value) => !value)}>
              {loading ? 'Stop Loading' : 'Start Loading'}
            </Button>
          </div>
          <div className="flex flex-col gap-5">
            {Array.from({ length: 24 }, (_, index) => (
              <section key={index} className="border-b pb-5">
                <h3 className="font-medium">Section {index + 1}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This content extends beyond the viewport so the browser body can scroll
                  while the overlay stays fixed to the screen.
                </p>
              </section>
            ))}
          </div>
        </div>
        <LoadingOverlay {...args} show={loading} message="Loading page..." />
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

/**
 * Container-scoped loader over a container with scrollable overflow content.
 * Verifies the overlay covers the visible container area correctly even
 * when the container has its own scrollbar.
 */
export const ContainerScopeWithScrollbar: Story = {
  args: {
    show: true,
    scope: 'container',
  },
  render: function ContainerScopeWithScrollbar(args) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) return;
      const timeoutId = setTimeout(() => {
        // setLoading(false);
      }, AUTO_HIDE_DELAY);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div
        id="loading-overlay-div-9"
        className="relative flex flex-col gap-4 items-start"
      >
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Stop Loading' : 'Start Loading'}
        </Button>
        <div
          id="loading-overlay-div-10"
          className="relative w-64 h-64 border rounded-md overflow-y-auto"
        >
          <div id="loading-overlay-div-11" className="p-4 flex flex-col gap-4">
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                Scrollable content row {index + 1}
              </p>
            ))}
          </div>
          <LoadingOverlay {...args} message="Loading..." show={loading} />
        </div>
      </div>
    );
  },
};

/**
 * Shows the loader while a drawer opens and its animated size settles.
 */
export const DrawerLoading: Story = {
  args: {
    show: false,
    scope: 'container',
  },
  render: function DrawerLoadingStory() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) setLoading(false);
    };

    const handleTriggerClick = () => {
      setLoading(true);
      setOpen(true);
      window.setTimeout(() => setLoading(false), DRAWER_LOADING_DURATION);
    };

    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" onClick={handleTriggerClick}>
            Open Drawer With Loading
          </Button>
        </DrawerTrigger>
        <DrawerContent floating className="sm:mx-auto sm:max-w-md">
          <LoadingOverlay message="Preparing drawer..." show={loading} />
          <DrawerHeader>
            <DrawerTitle>Ready to continue</DrawerTitle>
            <DrawerDescription>
              The loader follows the drawer while it opens.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm">
              Drawer content is available after preparation finishes.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};
