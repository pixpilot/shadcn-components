import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
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
