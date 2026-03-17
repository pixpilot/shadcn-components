import { cn, ColorPickerSwatch as OrgColorPickerSwatch } from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerSwatchProps extends React.ComponentProps<
  typeof OrgColorPickerSwatch
> {}

const ColorPickerSwatch: React.FC<ColorPickerSwatchProps> = (props) => {
  return (
    <OrgColorPickerSwatch
      {...props}
      className={cn('rounded-sm w-6.5 h-6.5 p-0 -ml-1 cursor-pointer', props.className)}
    />
  );
};

ColorPickerSwatch.displayName = 'ColorPickerSwatch';

export { ColorPickerSwatch };
