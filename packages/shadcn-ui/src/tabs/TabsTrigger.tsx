import type { BaseTabsTriggerProps, TabsVariant } from './types';
import { TabsTrigger as BaseTabsTrigger, cn } from '@pixpilot/shadcn';
import React from 'react';
import { useTabsContext } from './TabsContext';

export interface TabsTriggerProps extends Omit<BaseTabsTriggerProps, 'variant'> {
  variant?: TabsVariant;
}

const TabsTrigger: React.FC<TabsTriggerProps> = (props) => {
  const { variant: propVariant, ...rest } = props;
  const context = useTabsContext();
  const variant = propVariant || context?.variant;

  const underlineClasses = cn(
    'data-[state=active]:border-primary m-0 mb-[-1px] rounded-none border-0 border-b-2 bg-transparent py-2 px-3 shadow-none',
  );

  // Handle underline variant separately as it's custom to shadcn-ui
  if (variant === 'underline') {
    return <BaseTabsTrigger {...rest} className={cn(underlineClasses, rest.className)} />;
  }

  // For other variants, pass them to the base component
  return (
    <BaseTabsTrigger
      {...rest}
      variant={variant as 'default' | 'outline' | 'ghost' | 'pill'}
    />
  );
};

TabsTrigger.displayName = 'TabsTrigger';

export { TabsTrigger };
