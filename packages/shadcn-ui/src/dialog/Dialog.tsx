import {
  DialogClose as BaseDialogClose,
  DialogContent as BaseDialogContent,
  cn,
} from '@pixpilot/shadcn';
import * as React from 'react';
import { isToastInteractionTarget } from '../overlay-panel/overlay-interaction';
import {
  OverlayPanelBody,
  OverlayPanelFooter,
  OverlayPanelHeader,
} from '../overlay-panel/OverlayPanel';

export interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof BaseDialogContent
> {
  fullscreen?: boolean;
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  DialogContentProps
>(({ className, fullscreen = false, onPointerDownOutside, ...props }, ref) => {
  const handleOnPointerDownOutside = React.useCallback(
    (event: Parameters<NonNullable<DialogContentProps['onPointerDownOutside']>>[0]) => {
      onPointerDownOutside?.(event);
      if (isToastInteractionTarget(event.target)) {
        event.preventDefault();
      }
    },
    [onPointerDownOutside],
  );

  return (
    <BaseDialogContent
      ref={ref}
      className={cn(
        'max-h-[calc(100%-2rem)] sm:max-h-[calc(100%-2rem)] w-fit max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-2rem)] flex min-h-0 flex-col gap-4 px-6 py-5',
        fullscreen && 'h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-none sm:max-w-none',
        className,
      )}
      onPointerDownOutside={handleOnPointerDownOutside}
      {...props}
    />
  );
});

DialogContent.displayName = 'DialogContent';

// DialogHeader.tsx
export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <OverlayPanelHeader data-slot="dialog-header" {...props} />;
}

// DialogBody.tsx
export function DialogBody(props: React.HTMLAttributes<HTMLDivElement>) {
  return <OverlayPanelBody data-slot="dialog-body" {...props} />;
}

// DialogFooter.tsx
export function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <OverlayPanelFooter data-slot="dialog-footer" {...props} />;
}

export function DialogClose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialogClose>) {
  return <BaseDialogClose className={cn(className)} {...props} />;
}
