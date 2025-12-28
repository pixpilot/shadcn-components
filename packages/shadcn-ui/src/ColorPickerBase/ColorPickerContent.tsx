import { ColorPickerContent as BaseColorPickerContent, cn } from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerContentProps extends React.ComponentProps<
  typeof BaseColorPickerContent
> {}

const ColorPickerContent: React.FC<ColorPickerContentProps> = (props) => {
  return (
    <BaseColorPickerContent
      {...props}
      className={cn('w-[280px] xs:w-[300px]', props.className)}
    >
      {/* Content goes here */}
    </BaseColorPickerContent>
  );
};

ColorPickerContent.displayName = 'ColorPickerContent';

export { ColorPickerContent };
