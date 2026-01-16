import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

const LayoutFooter = React.forwardRef<HTMLDivElement, LayoutFooterProps>(
  ({ className, as: Component = 'div', ...props }, ref) => (
    <Component data-slot="layout-footer" {...props} className={cn(className)} ref={ref} />
  ),
);

LayoutFooter.displayName = 'LayoutFooter';

export { LayoutFooter };
