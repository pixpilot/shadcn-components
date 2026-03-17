import {
  ColorPickerInput as BaseColorPickerInput,
  useColorPicker,
} from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerFormatInputProps extends React.ComponentProps<
  typeof BaseColorPickerInput
> {}

const ColorPickerFormatInput: React.FC<ColorPickerFormatInputProps> = (props) => {
  const format = useColorPicker((s) => s.format);

  if (format === 'hex') {
    return <BaseColorPickerInput {...props} />;
  }

  return (
    <BaseColorPickerInput
      {...props}
      className="[&_input]:px-0 [&_input]:w-full [&_input]:min-w-0 flex-1 [&_input]:text-center"
    />
  );
};

ColorPickerFormatInput.displayName = 'ColorPickerFormatInput';

export { ColorPickerFormatInput };
