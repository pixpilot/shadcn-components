'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@pixpilot/shadcn-ui';

export interface DashboardPageContentProps extends ComponentPropsWithoutRef<'div'> {}

/** Provides the consistent width, layout, and spacing for dashboard pages. */
export function DashboardPageContent({
  children,
  className,
  ...props
}: DashboardPageContentProps): ReactNode {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto flex w-full max-w-[55rem] flex-col justify-center gap-6 pb-15',
        className,
      )}
    >
      {children}
    </div>
  );
}
