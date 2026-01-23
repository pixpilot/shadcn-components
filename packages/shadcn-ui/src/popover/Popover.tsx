import {
  cn,
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent as RadixPopoverContent,
} from '@pixpilot/shadcn';
import React from 'react';

export interface PopoverContentProps extends React.ComponentProps<
  typeof RadixPopoverContent
> {}

const PopoverContent: React.FC<PopoverContentProps> = (props) => {
  return (
    <RadixPopoverContent
      {...props}
      className={cn(
        // sizing
        'w-auto max-w-[var(--radix-popover-content-available-width)]',
        'max-h-[var(--radix-popover-content-available-height)]',

        // scrolling
        'overflow-auto',

        // reset styles
        'border-0 bg-transparent p-0',
        props.className,
      )}
    />
  );
};

PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
