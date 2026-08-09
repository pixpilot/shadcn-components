'use client';

import * as React from 'react';

export type PortalContainerRef = React.RefObject<HTMLElement | null>;
export type PortalContainer = Element | DocumentFragment;

const PortalContainerContext = React.createContext<PortalContainerRef | null>(null);

function subscribeToPortalContainer(listener: () => void) {
  if (typeof document === 'undefined') {
    return () => undefined;
  }

  const observer = new MutationObserver(listener);
  observer.observe(document, { childList: true, subtree: true });

  return () => observer.disconnect();
}

export interface PortalContainerProviderProps {
  children: React.ReactNode;
  portalContainerRef?: PortalContainerRef;
}

export function PortalContainerProvider({
  children,
  portalContainerRef,
}: PortalContainerProviderProps) {
  return (
    <PortalContainerContext.Provider value={portalContainerRef ?? null}>
      {children}
    </PortalContainerContext.Provider>
  );
}

export function usePortalContainer(container?: PortalContainer | null) {
  const portalContainerRef = React.useContext(PortalContainerContext);

  return React.useSyncExternalStore(
    subscribeToPortalContainer,
    () => container ?? portalContainerRef?.current ?? undefined,
    () => undefined,
  );
}
