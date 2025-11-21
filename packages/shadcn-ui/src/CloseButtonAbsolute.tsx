import { cn } from '@internal/shadcn';
import React from 'react';
import { CloseButtonRounded } from './CloseButtonRounded';

export interface PopoverCloseButtonProps
  extends React.ComponentProps<typeof CloseButtonRounded> {}

const CloseButtonAbsolute: React.FC<PopoverCloseButtonProps> = (props) => {
  return (
    <CloseButtonRounded
      {...props}
      className={cn('absolute top-1 right-1', props.className)}
    />
  );
};

CloseButtonAbsolute.displayName = 'CloseButtonAbsolute';

export { CloseButtonAbsolute };
