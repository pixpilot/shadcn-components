'use client';

import type { ButtonProps } from '@pixpilot/shadcn-ui';
import { Button, cn } from '@pixpilot/shadcn-ui';
import React from 'react';

/**
 * Pass the logo as `children` and route from `onClick`: the dashboard does
 * not know the host's home route or router.
 */
export interface DashboardLogoProps extends ButtonProps {}

/** The round, icon-sized button the sidebar shows beside its title. */
const DashboardLogo: React.FC<DashboardLogoProps> = ({ className, ...props }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7 rounded-full p-0', className)}
      {...props}
    />
  );
};

DashboardLogo.displayName = 'DashboardLogo';

export { DashboardLogo };
