import { TabsList as BaseTabsList } from '@pixpilot/shadcn';
import React from 'react';

export type TabsListVariant = 'default' | 'underline' | 'outline' | 'ghost' | 'pill';

export interface TabsListProps extends Omit<
  React.ComponentProps<typeof BaseTabsList>,
  'variant'
> {
  variant?: TabsListVariant;
}

const TabsList: React.FC<TabsListProps> = (props) => {
  const { variant, ...rest } = props;

  // Handle underline variant separately as it's custom to shadcn-ui
  if (variant === 'underline') {
    return (
      <BaseTabsList
        {...rest}
        className="bg-transparent p-0 h-auto rounded-none border-b border-border"
      />
    );
  }

  // For other variants, pass them to the base component
  return (
    <BaseTabsList
      {...rest}
      variant={variant as 'default' | 'outline' | 'ghost' | 'pill'}
    />
  );
};

export { TabsList };
