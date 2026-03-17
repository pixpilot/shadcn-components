import {
  cn,
  ColorPickerTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from '@pixpilot/shadcn';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React from 'react';
import { useColorPickerContext } from './color-picker-context';
import { ColorPickerSwatch } from './ColorPickerSwatch';

export interface ColorPickerButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'value'
> {
  formatDisplayValue?: (value: string) => React.ReactNode;
  placeholder?: string;
  slots?: {
    swatch: React.ComponentProps<typeof ColorPickerSwatch>;
  };
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = (props) => {
  const { slots, formatDisplayValue, placeholder = 'Pick a color', ...rest } = props;

  const { isPickerOpen, color, onColorChange } = useColorPickerContext();

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    if (onColorChange === undefined) {
      throw new Error(
        'ColorPickerButton must be used within a ColorPickerRoot component',
      );
    }
  }

  const renderDisplayValue = (): React.ReactNode => {
    if (color == null || color === '') return placeholder;
    return formatDisplayValue != null ? formatDisplayValue(color) : color;
  };

  const currentcolor = color != null && color !== '' ? color : undefined;
  return (
    <ColorPickerTrigger asChild>
      <InputGroup
        {...rest}
        className={cn(
          'dark:hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          rest.className,
        )}
      >
        <InputGroupAddon align="inline-start">
          <ColorPickerSwatch color={currentcolor} {...slots?.swatch} />
        </InputGroupAddon>
        <InputGroupText className="flex-1 text-left text-foreground pl-2">
          {renderDisplayValue()}
        </InputGroupText>
        <InputGroupAddon align="inline-end" className="">
          {isPickerOpen ? (
            <ChevronUpIcon className="size-4 opacity-50" />
          ) : (
            <ChevronDownIcon className="size-4 opacity-50" />
          )}
        </InputGroupAddon>
      </InputGroup>
    </ColorPickerTrigger>
  );
};

ColorPickerButton.displayName = 'ColorPickerButton';

export { ColorPickerButton };
