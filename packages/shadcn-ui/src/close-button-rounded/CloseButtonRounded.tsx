import { Button, cn } from '@pixpilot/shadcn';
import { X } from 'lucide-react';
import React from 'react';

export interface CloseButtonRoundedProps extends React.ComponentProps<typeof Button> {}

const CloseButtonRounded: React.FC<CloseButtonRoundedProps> = (props) => {
  return (
    <Button
      {...props}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full p-0',
        props.className,
      )}
    >
      <X className="h-5 w-5" />
    </Button>
  );
};

CloseButtonRounded.displayName = 'CloseButtonRounded';

export { CloseButtonRounded };
