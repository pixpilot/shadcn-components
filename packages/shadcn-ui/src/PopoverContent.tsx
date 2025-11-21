import { PopoverContent as RadixPopoverContent } from '@internal/shadcn';
import React from 'react';

export interface PopoverContentProps
  extends React.ComponentProps<typeof RadixPopoverContent> {}

const PopoverContent: React.FC<PopoverContentProps> = (props) => {
  return (
    <RadixPopoverContent
      {...props}
      className="w-auto max-w-[100vw] border-0 bg-transparent p-0 sm:max-w-[calc(100vw-2rem)]"
    />
  );
};

PopoverContent.displayName = 'PopoverContent';

export { PopoverContent };
