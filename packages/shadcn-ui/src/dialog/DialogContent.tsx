import { DialogContent as BaseDialogContent, cn } from '@pixpilot/shadcn';
import * as React from 'react';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  React.ComponentPropsWithoutRef<typeof BaseDialogContent>
>(({ className, ...props }, ref) => (
  <BaseDialogContent
    ref={ref}
    className={cn('max-h-[85vh] sm:max-h-[90vh] flex flex-col', className)}
    {...props}
  />
));

DialogContent.displayName = 'DialogContent';

export { DialogContent };
