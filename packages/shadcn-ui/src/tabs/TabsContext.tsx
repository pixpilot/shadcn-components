import type { TabsVariant } from './types';
import React from 'react';

export interface TabsContextValue {
  variant?: TabsVariant;
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function useTabsContext() {
  const context = React.use(TabsContext);
  return context;
}
