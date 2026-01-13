import { ColorPickerContent as BaseColorPickerContent, cn } from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerContentProps extends React.ComponentProps<
  typeof BaseColorPickerContent
> {}

const ColorPickerContent: React.FC<ColorPickerContentProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <BaseColorPickerContent {...rest} className={cn('w-[280px] xs:w-[300px]', className)}>
      {children}
    </BaseColorPickerContent>
  );
};

ColorPickerContent.displayName = 'ColorPickerContent';

export { ColorPickerContent };
