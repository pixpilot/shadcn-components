/* eslint-disable react/no-context-provider */
import type { PortalContainerRef } from '@pixpilot/shadcn';
import NiceModal from '@ebay/nice-modal-react';
import { PortalContainerProvider } from '@pixpilot/shadcn';
import React, { createContext, use } from 'react';

export interface OverlayProviderProps {
  children: React.ReactNode;
  portalContainerRef?: PortalContainerRef;
}

/**
 * Shared "an overlay provider is mounted" flag.
 *
 * This is intentionally shared across every provider built with
 * `createOverlayProvider` (DialogProvider, DrawerProvider, …). NiceModal keeps a
 * single global modal store behind one `NiceModal.Provider`; mounting a second
 * `NiceModal.Provider` anywhere below the first shadows it, so modals registered
 * against the outer store become invisible (and in-flight `show()` promises
 * never resolve after a remount).
 *
 * By sharing this context, a DrawerProvider mounted inside a DialogProvider (or
 * vice versa) becomes a safe no-op instead of creating a second store.
 */
const OverlayProviderMountedContext = createContext(false);

/**
 * Builds a nesting-safe overlay provider component.
 *
 * The returned provider renders `NiceModal.Provider` only if no overlay provider
 * is already mounted above it; otherwise it passes children through unchanged.
 *
 * @param displayName - React display name for the returned component.
 */
export function createOverlayProvider(
  displayName: string,
): React.FC<OverlayProviderProps> {
  const OverlayProvider: React.FC<OverlayProviderProps> = (props) => {
    const isAlreadyMounted = use(OverlayProviderMountedContext);

    // If a provider is already above us in the tree, just pass children through.
    if (isAlreadyMounted) {
      return (
        <PortalContainerProvider portalContainerRef={props.portalContainerRef}>
          {props.children}
        </PortalContainerProvider>
      );
    }

    return (
      <PortalContainerProvider portalContainerRef={props.portalContainerRef}>
        <OverlayProviderMountedContext.Provider value={true}>
          <NiceModal.Provider>{props.children}</NiceModal.Provider>
        </OverlayProviderMountedContext.Provider>
      </PortalContainerProvider>
    );
  };

  OverlayProvider.displayName = displayName;

  return OverlayProvider;
}

export const OverlayProvider = createOverlayProvider('OverlayProvider');
