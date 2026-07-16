import type React from 'react';
import type { SyncReactNode } from '../../types';
import { Button, cn } from '@pixpilot/shadcn';
import { ChevronRightIcon } from 'lucide-react';

export interface OverlayTriggerProps extends Omit<
  React.ComponentProps<typeof Button>,
  'children'
> {
  /** Text of the trigger button. */
  label?: SyncReactNode;
  /** Icon rendered at the trailing edge. Defaults to a chevron. */
  icon?: React.ReactNode;
  /** Renders the trigger in an error state. */
  invalid?: boolean;
}

/**
 * Button that opens an object overlay (dialog or popover).
 */
export const OverlayTrigger: React.FC<OverlayTriggerProps> = ({
  label,
  icon,
  invalid,
  className,
  ...rest
}) => (
  <Button
    type="button"
    variant="outline"
    aria-invalid={invalid === true ? true : undefined}
    {...rest}
    className={cn(
      'form-object-trigger w-full justify-between gap-4 font-normal',
      invalid === true && 'border-destructive text-destructive',
      className,
    )}
  >
    <span className="min-w-0 truncate text-left">{label}</span>
    {icon ?? <ChevronRightIcon className="size-4 shrink-0 opacity-50" />}
  </Button>
);

OverlayTrigger.displayName = 'OverlayTrigger';
