'use client';

import React, { createContext, use, useMemo, useState } from 'react';

export interface DashboardProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
}
interface DashboardContextValue extends Pick<DashboardProps, 'logo'> {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider: React.FC<DashboardProps> = ({ children, logo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const value = useMemo(
    () => ({ isSidebarOpen, setIsSidebarOpen, logo }),
    [isSidebarOpen, logo],
  );

  return <DashboardContext value={value}>{children}</DashboardContext>;
};

export function useDashboard(): DashboardContextValue {
  const context = use(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used inside DashboardProvider');
  }

  return context;
}
