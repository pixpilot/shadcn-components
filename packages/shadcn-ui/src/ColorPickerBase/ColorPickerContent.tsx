import type { ColorPickerContentWrapperProps } from './types';

import { ColorPickerContent as BaseColorPickerContent, cn } from '@pixpilot/shadcn';
import React from 'react';

const ColorPickerContent: React.FC<ColorPickerContentWrapperProps> = (props) => {
  const { children, className, width, ...rest } = props;

  const handleOpenAutoFocus = React.useCallback((event: Event) => {
    // Prevent Radix from auto-focusing the first swatch button when the popover opens.
    // Keeping focus on the trigger avoids a confusing “first preset is focused” state.
    event.preventDefault();
  }, []);

  return (
    <BaseColorPickerContent
      {...rest}
      className={cn('w-[280px] xs:w-[300px]', className)}
      style={width !== undefined ? { width } : undefined}
      onOpenAutoFocus={handleOpenAutoFocus}
    >
      {children}
    </BaseColorPickerContent>
  );
};

ColorPickerContent.displayName = 'ColorPickerContent';

export { ColorPickerContent };
