/* eslint-disable react/no-context-provider */
import NiceModal from '@ebay/nice-modal-react';
import React, { createContext, use } from 'react';

export interface DialogProviderProps {
  children: React.ReactNode;
}

// Guard context to detect nesting
const DialogProviderMountedContext = createContext(false);

/**
 * Guards against nested DialogProviders, which would break NiceModal.
 *
 * NiceModal.Provider creates its own isolated modal state store via React context.
 * If a second NiceModal.Provider mounts anywhere below the first, it shadows the
 * outer one — meaning modals registered/shown inside the inner provider are
 * invisible to the outer one, and vice versa.
 *
 * This becomes especially bad with navigation: when you navigate away and back,
 * the inner provider unmounts and remounts, creating a brand-new store. Any
 * in-flight `showConfirmDialog` calls still hold a reference to the old store's
 * dispatch, so their promises never resolve and the modal tree is left in a
 * broken state.
 *
 * The fix: track whether a DialogProvider is already mounted above us in the tree.
 * If one is, skip rendering NiceModal.Provider entirely and just pass children
 * through — making the inner DialogProvider a safe no-op.
 */
const DialogProvider: React.FC<DialogProviderProps> = (props) => {
  const isAlreadyMounted = use(DialogProviderMountedContext);

  // If a provider is already above us in the tree, just pass children through
  if (isAlreadyMounted) {
    return <>{props.children}</>;
  }

  return (
    <DialogProviderMountedContext.Provider value={true}>
      <NiceModal.Provider>{props.children}</NiceModal.Provider>
    </DialogProviderMountedContext.Provider>
  );
};

DialogProvider.displayName = 'DialogProvider';

export { DialogProvider };
