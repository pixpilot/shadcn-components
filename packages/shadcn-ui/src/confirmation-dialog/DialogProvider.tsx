import NiceModal from '@ebay/nice-modal-react';

import React from 'react';

export interface DialogProviderProps {
  children?: React.ReactNode;
}

const DialogProvider: React.FC<DialogProviderProps> = (props) => {
  return <NiceModal.Provider>{props.children}</NiceModal.Provider>;
};

DialogProvider.displayName = 'DialogProvider';

export { DialogProvider };
