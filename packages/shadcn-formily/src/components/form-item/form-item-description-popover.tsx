import type { SyncReactNode } from '../../types';
import { cn, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn';
import { HelpCircleIcon } from 'lucide-react';
import React from 'react';

export interface FormItemDescriptionPopoverProps {
  description: SyncReactNode;
  className?: string;
}

export function FormItemDescriptionPopover({
  description,
  className,
}: FormItemDescriptionPopoverProps) {
  const CLOSE_DELAY_MS = 120;
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const clearCloseTimer = () => {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  React.useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Show description"
          className={cn(
            'text-muted-foreground inline-flex items-center justify-center rounded-sm',
            className,
          )}
          onMouseEnter={() => {
            clearCloseTimer();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
          onFocus={() => {
            clearCloseTimer();
            setOpen(true);
          }}
          onBlur={scheduleClose}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <HelpCircleIcon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-80"
        onMouseEnter={() => {
          clearCloseTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <div className="text-sm leading-relaxed">{description}</div>
      </PopoverContent>
    </Popover>
  );
}
