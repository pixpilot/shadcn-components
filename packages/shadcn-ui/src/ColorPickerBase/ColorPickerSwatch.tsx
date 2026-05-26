import { cn, ColorPickerSwatch as OrgColorPickerSwatch } from '@pixpilot/shadcn';
import React from 'react';

export interface ColorPickerSwatchProps extends React.ComponentProps<
  typeof OrgColorPickerSwatch
> {}

const ColorPickerSwatch: React.FC<ColorPickerSwatchProps> = (props) => {
  const styles: React.CSSProperties = {};

  return (
    <OrgColorPickerSwatch
      {...props}
      style={{
        ...styles,
        ...props.style,
      }}
      className={cn(
        'rounded-sm w-6.5 h-6.5 p-0 -ml-1 cursor-pointer relative flex items-center justify-center',
        props.className,
      )}
    />
  );
};

ColorPickerSwatch.displayName = 'ColorPickerSwatch';

export { ColorPickerSwatch };
