import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutMainProps extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
  as?: React.ElementType;
}

const LayoutMain = React.forwardRef<HTMLDivElement, LayoutMainProps>(
  ({ autoScroll = true, className, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        data-slot="layout-main"
        ref={ref}
        className={cn('flex-1', { 'overflow-auto': autoScroll }, className)}
        {...props}
      />
    );
  },
);

LayoutMain.displayName = 'LayoutMain';

export { LayoutMain };
