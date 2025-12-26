import type { TabsVariant } from './types';
import { TabsList as BaseTabsList, cn } from '@pixpilot/shadcn';
import React from 'react';
import { TabsContext } from './TabsContext';

export interface TabsListProps extends Omit<
  React.ComponentProps<typeof BaseTabsList>,
  'variant'
> {
  variant?: TabsVariant;
}

const TabsList: React.FC<TabsListProps> = (props) => {
  const { variant, children, ...rest } = props;

  // Memoize the context value to avoid recreating the object on every render
  const contextValue = React.useMemo(() => ({ variant }), [variant]);

  // Handle underline variant separately as it's custom to shadcn-ui
  if (variant === 'underline') {
    return (
      <TabsContext value={contextValue}>
        <BaseTabsList
          {...rest}
          className={cn(
            'bg-transparent p-0 h-auto rounded-none border-b border-border w-full',
            rest.className,
          )}
        >
          {children}
        </BaseTabsList>
      </TabsContext>
    );
  }

  // For other variants, pass them to the base component
  return (
    <TabsContext value={contextValue}>
      <BaseTabsList
        {...rest}
        variant={variant as 'default' | 'outline' | 'ghost' | 'pill'}
      >
        {children}
      </BaseTabsList>
    </TabsContext>
  );
};

export { TabsList };
