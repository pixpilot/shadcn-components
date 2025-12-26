import type { BaseTabsTriggerProps, TabsTriggerVariant } from './types';
import { TabsTrigger as BaseTabsTrigger, cn } from '@pixpilot/shadcn';
import React from 'react';

export interface TabsTriggerProps extends Omit<BaseTabsTriggerProps, 'variant'> {
  variant?: TabsTriggerVariant;
}

const TabsTrigger: React.FC<TabsTriggerProps> = (props) => {
  const { variant, ...rest } = props;

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
