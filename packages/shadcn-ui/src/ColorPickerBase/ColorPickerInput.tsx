import {
  ColorPickerInput as BaseColorPickerInput,
  useColorPicker,
} from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerInputProps extends React.ComponentProps<
  typeof BaseColorPickerInput
> {}

const ColorPickerInput: React.FC<ColorPickerInputProps> = (props) => {
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

ColorPickerInput.displayName = 'ColorPickerInput';

export { ColorPickerInput };
