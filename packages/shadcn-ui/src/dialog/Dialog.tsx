import { DialogContent as BaseDialogContent, cn } from '@pixpilot/shadcn';
import * as React from 'react';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  React.ComponentPropsWithoutRef<typeof BaseDialogContent>
>(({ className, ...props }, ref) => (
  <BaseDialogContent
    ref={ref}
    className={cn('max-h-[85vh] sm:max-h-[90vh] flex flex-col p-0 gap-0', className)}
    {...props}
  />
));

DialogContent.displayName = 'DialogContent';

// DialogHeader.tsx
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="header"
      className={cn('flex flex-col space-y-1.5 px-6 py-4', className)}
      {...props}
    />
  );
}

// DialogBody.tsx
// Note: Uses py-2 for tighter spacing compared to header/footer (py-4)
// to create content-dense dialogs while maintaining visual hierarchy
export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="body"
      className={cn('flex-1 overflow-y-auto px-6 py-2', className)}
      {...props}
    />
  );
}

// DialogFooter.tsx
export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="footer"
      className={cn('flex justify-end space-x-2 px-6 py-4', className)}
      {...props}
    />
  );
}

export { DialogContent };
