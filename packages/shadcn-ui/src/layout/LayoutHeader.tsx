import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutHeader = React.forwardRef<HTMLDivElement, LayoutHeaderProps>(
  ({ className, ...props }, ref) => (
    <div {...props} className={cn(className)} ref={ref} />
  ),
);

LayoutHeader.displayName = 'LayoutHeader';

export { LayoutHeader };
