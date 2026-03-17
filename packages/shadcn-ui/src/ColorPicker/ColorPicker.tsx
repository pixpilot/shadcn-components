'use client';

import type { ColorPickerBaseProps } from '../ColorPickerBase';

import { ColorPickerBase, ColorPickerButton, ColorPickerInput } from '../ColorPickerBase';

export interface ColorPickerProps extends Omit<ColorPickerBaseProps, 'children'> {
  variant?: 'button' | 'input';
  placeholder?: string;
  formatDisplayValue?: (value: string) => React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { variant = 'input', formatDisplayValue, ...rest } = props;

  const Input = variant === 'input' ? ColorPickerInput : ColorPickerButton;

  return (
    <ColorPickerBase {...rest}>
      <Input />
    </ColorPickerBase>
  );
};

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
