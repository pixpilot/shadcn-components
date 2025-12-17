import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutFooter = React.forwardRef<HTMLDivElement, LayoutFooterProps>(
  ({ className, ...props }, ref) => (
    <div {...props} className={cn(className)} ref={ref} />
  ),
);

LayoutFooter.displayName = 'LayoutFooter';

export { LayoutFooter };
