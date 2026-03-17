import { cn, ColorPickerFormatSelect } from '@pixpilot/shadcn';
import React from 'react';
import { ColorPickerFormatInput } from './ColorPickerFormatInput';

export interface ColorPickerFormatControlsProps extends React.ComponentProps<'div'> {
  showFormatSelect?: boolean;
  showInput?: boolean;
}

const ColorPickerFormatControls: React.FC<ColorPickerFormatControlsProps> = (props) => {
  const { showFormatSelect = true, showInput = true, ...rest } = props;

  return (
    <div {...rest} className={cn('flex items-center gap-2 w-full', rest.className)}>
      {showFormatSelect && <ColorPickerFormatSelect />}
      {showInput && <ColorPickerFormatInput />}
    </div>
  );
};

ColorPickerFormatControls.displayName = 'ColorPickerFormatControls';

export { ColorPickerFormatControls, ColorPickerFormatInput, ColorPickerFormatSelect };
