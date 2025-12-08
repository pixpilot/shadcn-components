import type { FC } from 'react';

import {
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixpilot/shadcn';

/**
 * Mount type for the icon picker
 * - 'dialog': Display as a modal dialog
 * - 'popover': Display as a popover anchored to the trigger button
 */
type MountType = 'dialog' | 'popover';

interface IconPickerProps {
  effectiveMode: MountType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectorContent: React.ReactNode;
  popover?: Partial<React.ComponentProps<typeof PopoverContent>>;
  children?: React.ReactNode;
}

export const IconPickerContainer: FC<IconPickerProps> = ({
  effectiveMode,
  isOpen,
  setIsOpen,
  selectorContent,
  children,
  popover,
}) => {
  return (
    <>
      {effectiveMode === 'dialog' && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="max-h-[80vh] w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select an Icon</DialogTitle>
            </DialogHeader>
            <div>{selectorContent}</div>
          </DialogContent>
        </Dialog>
      )}

      {effectiveMode === 'popover' && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{children}</PopoverTrigger>
          <PopoverContent
            side="right"
            {...popover}
            className={cn(
              'w-full min-w-sm lg:min-w-lg p-4',
              'max-h-dvh md:max-h-auto',
              popover?.className,
            )}
          >
            {selectorContent}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
