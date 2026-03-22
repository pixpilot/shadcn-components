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

const commonStyles = cn(
  // sizing
  'w-auto max-w-[var(--radix-popover-content-available-width)]',
  'max-h-[var(--radix-popover-content-available-height)]',

  // scrolling
  'overflow-auto',
);

const PopoverContentUnstyled: React.FC<PopoverContentProps> = (props) => {
  return (
    <RadixPopoverContent
      {...props}
      className={cn(
        // reset styles (moved here)
        'border-0 bg-transparent p-0',
        commonStyles,
        props.className,
      )}
    />
  );
};

const PopoverContent: React.FC<PopoverContentProps> = (props) => {
  const { className, ...rest } = props;

  return <RadixPopoverContent {...rest} className={cn(commonStyles, className)} />;
};

PopoverContentUnstyled.displayName = 'PopoverContentUnstyled';

PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverAnchor, PopoverContent, PopoverContentUnstyled, PopoverTrigger };
