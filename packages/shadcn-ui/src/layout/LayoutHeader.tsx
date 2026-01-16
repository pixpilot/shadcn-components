import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

const LayoutHeader = React.forwardRef<HTMLDivElement, LayoutHeaderProps>(
  ({ className, as: Component = 'div', ...props }, ref) => (
    <Component data-slot="layout-header" {...props} className={cn(className)} ref={ref} />
  ),
);

LayoutHeader.displayName = 'LayoutHeader';

export { LayoutHeader };
