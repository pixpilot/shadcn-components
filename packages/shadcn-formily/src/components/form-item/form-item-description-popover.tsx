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
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Show description"
          className={cn(
            'text-muted-foreground inline-flex items-center justify-center rounded-sm hover:text-foreground transition-colors',
            className,
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen((prev) => !prev)}
        >
          <HelpCircleIcon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-80 bg-card border border-border"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="text-sm leading-relaxed text-foreground">{description}</div>
      </PopoverContent>
    </Popover>
  );
}
