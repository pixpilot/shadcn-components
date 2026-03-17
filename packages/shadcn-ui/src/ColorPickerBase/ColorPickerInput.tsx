import {
  ColorPickerTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@pixpilot/shadcn';
import React from 'react';
import { useColorPickerContext } from './color-picker-context';
import { ColorPickerSwatch } from './ColorPickerSwatch';

export interface ColorPickerInputProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value'
> {
  slots?: {
    swatch: React.ComponentProps<typeof ColorPickerSwatch>;
  };
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = (props) => {
  const { slots, onChange, ...rest } = props;

  const { isPickerOpen, color, onColorChange } = useColorPickerContext();

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    if (onColorChange === undefined) {
      throw new Error('ColorPickerInput must be used within a ColorPickerRoot component');
    }
  }

  const currentcolor = color != null && color !== '' ? color : undefined;
  return (
    <ColorPickerTrigger asChild>
      <InputGroup className="w-full">
        <InputGroupAddon align="inline-start">
          <ColorPickerSwatch color={currentcolor} {...slots?.swatch} />
        </InputGroupAddon>
        <InputGroupInput
          value={color ?? ''}
          {...rest}
          onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => {
            rest.onPointerDown?.(e);
            if (isPickerOpen) return;
            e.stopPropagation();
          }}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            rest.onClick?.(e);
            if (isPickerOpen) return;
            e.stopPropagation();
          }}
          onChange={(e) => {
            onColorChange(e.target.value);
            onChange?.(e);
          }}
        />
      </InputGroup>
    </ColorPickerTrigger>
  );
};

ColorPickerInput.displayName = 'ColorPickerInput';

export { ColorPickerInput };
