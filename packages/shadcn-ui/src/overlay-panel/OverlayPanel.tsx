import { cn } from '@pixpilot/shadcn';
import * as React from 'react';

/**
 * Shared layout building blocks for panel-style overlays (Dialog, Drawer).
 * Centralizes the header/body/footer styling so both stay visually
 * consistent; each overlay wraps these with its own `data-slot` value and
 * any overlay-specific behavior (e.g. Drawer's drag-to-dismiss opt-out).
 */

function createOverlayPanelPart(baseClassName: string) {
  return function OverlayPanelPart({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(baseClassName, className)} {...props} />;
  };
}

export const OverlayPanelHeader = createOverlayPanelPart(
  'flex shrink-0 flex-col gap-2.5',
);

export const OverlayPanelBody = createOverlayPanelPart(
  'min-h-0 flex-1 overflow-auto -mx-6 px-6 py-1.5 -my-1.5',
);

export const OverlayPanelFooter = createOverlayPanelPart(
  'flex shrink-0 justify-end space-x-2',
);
