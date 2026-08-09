import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@pixpilot/shadcn';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayProvider } from '../../src/overlay-provider';

const mocks = vi.hoisted(() => ({
  niceModalProvider: vi.fn(({ children }: { children: React.ReactNode }) => children),
}));

window.matchMedia ??= (() => ({
  addEventListener: () => undefined,
  addListener: () => undefined,
  dispatchEvent: () => false,
  matches: false,
  media: '',
  onchange: null,
  removeEventListener: () => undefined,
  removeListener: () => undefined,
})) as typeof window.matchMedia;

vi.mock('@ebay/nice-modal-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ebay/nice-modal-react')>();

  return {
    ...actual,
    default: { ...actual.default, Provider: mocks.niceModalProvider },
  };
});

afterEach(() => {
  mocks.niceModalProvider.mockClear();
});

function DialogFixture({ container }: { container?: HTMLElement }) {
  return (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent container={container} aria-describedby={undefined}>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogDescription>Dialog description</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function DrawerFixture() {
  return (
    <Drawer>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Drawer title</DrawerTitle>
        <DrawerDescription>Drawer description</DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}

describe('overlay provider portal containers', () => {
  it('uses the provider container for dialog portals', async () => {
    function Fixture() {
      const portalContainerRef = React.useRef<HTMLDivElement>(null);

      return (
        <OverlayProvider portalContainerRef={portalContainerRef}>
          <DialogFixture />
          <div ref={portalContainerRef} data-testid="dialog-container" />
        </OverlayProvider>
      );
    }

    render(<Fixture />);
    fireEvent.click(screen.getByText('Open dialog'));

    await waitFor(() => {
      expect(
        screen.getByTestId('dialog-container').contains(screen.getByText('Dialog title')),
      ).toBe(true);
    });
  });

  it('uses the provider container for drawer portals', async () => {
    function Fixture() {
      const portalContainerRef = React.useRef<HTMLDivElement>(null);

      return (
        <OverlayProvider portalContainerRef={portalContainerRef}>
          <DrawerFixture />
          <div ref={portalContainerRef} data-testid="drawer-container" />
        </OverlayProvider>
      );
    }

    render(<Fixture />);
    fireEvent.click(screen.getByText('Open drawer'));

    await waitFor(() => {
      expect(
        screen.getByTestId('drawer-container').contains(screen.getByText('Drawer title')),
      ).toBe(true);
    });
  });

  it('lets an explicit dialog container override the provider container', async () => {
    const explicitContainer = document.createElement('div');
    document.body.appendChild(explicitContainer);

    function Fixture() {
      const portalContainerRef = React.useRef<HTMLDivElement>(null);

      return (
        <OverlayProvider portalContainerRef={portalContainerRef}>
          <DialogFixture container={explicitContainer} />
          <div ref={portalContainerRef} data-testid="provider-container" />
        </OverlayProvider>
      );
    }

    render(<Fixture />);
    fireEvent.click(screen.getByText('Open dialog'));

    await waitFor(() => {
      expect(explicitContainer.contains(screen.getByText('Dialog title'))).toBe(true);
    });
    expect(
      screen.getByTestId('provider-container').contains(screen.getByText('Dialog title')),
    ).toBe(false);

    explicitContainer.remove();
  });

  it('keeps one NiceModal provider while an inner provider overrides the portal container', async () => {
    function Fixture() {
      const outerPortalContainerRef = React.useRef<HTMLDivElement>(null);
      const innerPortalContainerRef = React.useRef<HTMLDivElement>(null);

      return (
        <OverlayProvider portalContainerRef={outerPortalContainerRef}>
          <div ref={outerPortalContainerRef} data-testid="outer-container" />
          <OverlayProvider portalContainerRef={innerPortalContainerRef}>
            <DialogFixture />
            <div ref={innerPortalContainerRef} data-testid="inner-container" />
          </OverlayProvider>
        </OverlayProvider>
      );
    }

    render(<Fixture />);
    fireEvent.click(screen.getByText('Open dialog'));

    await waitFor(() => {
      expect(
        screen.getByTestId('inner-container').contains(screen.getByText('Dialog title')),
      ).toBe(true);
    });
    expect(
      screen.getByTestId('outer-container').contains(screen.getByText('Dialog title')),
    ).toBe(false);
    expect(mocks.niceModalProvider).toHaveBeenCalledTimes(1);
  });

  it('preserves the default document body portal without a provider', async () => {
    render(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await waitFor(() => {
      expect(document.body.contains(screen.getByText('Dialog title'))).toBe(true);
    });
  });
});
