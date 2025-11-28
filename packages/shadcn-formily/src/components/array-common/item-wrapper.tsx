import type { ArrayField } from '@formily/core';
import { useField } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { hasArrayItemErrors } from '../../utils';

export interface ItemWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  children: React.ReactNode;
}

const ItemWrapper: React.FC<ItemWrapperProps> = (props) => {
  const { index, children, ...rest } = props;

  const field = useField<ArrayField>();

  const hasErrors = hasArrayItemErrors(field, index);

  return (
    <div
      {...rest}
      className={cn(
        'border-input bg-card rounded-md border  transition-colors items-center',
        hasErrors && 'border-destructive border-2',
        props.className,
      )}
    >
      {children}
      {/* <div className="flex items-center gap-2 px-3 py-2"></div> */}
    </div>
  );
};

ItemWrapper.displayName = 'ItemWrapper';

export { ItemWrapper };
