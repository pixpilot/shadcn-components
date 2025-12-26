import { cn } from '@pixpilot/shadcn';
import React from 'react';

/**
 * Stretched element to enable tooltips on disabled buttons
 * When a button is disabled, tooltips don't work by default.
 * This element is positioned absolutely over the button to capture events.
 */
export function AbsoluteFill(
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
) {
  const { ref, className, ...rest } = props;
  return (
    <div
      ref={ref}
      {...rest}
      className={cn('absolute top-0 right-0 bottom-0 left-0', className)}
    />
  );
}
AbsoluteFill.displayName = 'StretchedElement';
