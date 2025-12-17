import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-col overflow-hidden',
          'h-dvh', // Better than h-screen (handles mobile bars)
          'max-h-full', // Respects the parent if the parent is smaller
          className,
        )}
        {...props}
      />
    );
  },
);

Layout.displayName = 'Layout';
export { Layout };
