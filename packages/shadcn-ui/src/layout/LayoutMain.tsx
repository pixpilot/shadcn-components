import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutMainProps extends React.HTMLAttributes<HTMLElement> {
  autoScroll?: boolean;
}

const LayoutMain = React.forwardRef<HTMLElement, LayoutMainProps>(
  ({ autoScroll = true, className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn('flex-1', { 'overflow-auto': autoScroll }, className)}
        {...props}
      />
    );
  },
);

LayoutMain.displayName = 'LayoutMain';

export { LayoutMain };
