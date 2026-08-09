/**
 * Regression tests for the custom portal-container support in Drawer.
 *
 * The shadcn CLI overwrites drawer.tsx when pulling an upstream component.
 * Keep DrawerPortal's usePortalContainer call and DrawerContent's use of the
 * enhanced portal so these tests continue to protect route-level scoping.
 */

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerPortal,
  DrawerTitle,
} from '../../../src/components/ui/drawer';
import { PortalContainerProvider } from '../../../src/components/ui/portal-container';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

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

function OpenDrawer() {
  return (
    <Drawer open>
      <DrawerContent>
        <DrawerTitle>Test Drawer</DrawerTitle>
        <DrawerDescription>Description</DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}

describe('drawer portal container support', () => {
  it('keeps the default document.body portal behavior without a provider', () => {
    render(<OpenDrawer />);

    const content = screen
      .getByText('Test Drawer')
      .closest('[data-slot="drawer-content"]');
    expect(content?.parentElement).toBe(document.body);
  });

  it('uses PortalContainerProvider for DrawerContent portals', () => {
    const providerContainer = document.createElement('div');
    document.body.appendChild(providerContainer);
    const portalContainerRef: React.RefObject<HTMLElement | null> = {
      current: providerContainer,
    };

    const view = render(
      <PortalContainerProvider portalContainerRef={portalContainerRef}>
        <OpenDrawer />
      </PortalContainerProvider>,
    );

    expect(
      providerContainer.querySelector('[data-slot="drawer-content"]'),
    ).not.toBeNull();
    expect(
      providerContainer.querySelector('[data-slot="drawer-overlay"]'),
    ).not.toBeNull();

    view.unmount();
    providerContainer.remove();
  });

  it('lets an explicit DrawerPortal container override PortalContainerProvider', () => {
    const providerContainer = document.createElement('div');
    const explicitContainer = document.createElement('div');
    document.body.append(providerContainer, explicitContainer);
    const portalContainerRef: React.RefObject<HTMLElement | null> = {
      current: providerContainer,
    };

    const view = render(
      <PortalContainerProvider portalContainerRef={portalContainerRef}>
        <Drawer open>
          <DrawerPortal container={explicitContainer}>
            <div data-testid="explicit-drawer-portal">Explicit drawer portal</div>
          </DrawerPortal>
        </Drawer>
      </PortalContainerProvider>,
    );

    expect(explicitContainer).toContainElement(
      screen.getByTestId('explicit-drawer-portal'),
    );
    expect(
      providerContainer.querySelector('[data-testid="explicit-drawer-portal"]'),
    ).toBeNull();

    view.unmount();
    providerContainer.remove();
    explicitContainer.remove();
  });
});
