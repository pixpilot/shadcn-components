'use client';

import type { ColorPickerBaseProps } from './types';
import { ColorPicker, ColorPickerTrigger } from '@pixpilot/shadcn';
import { useCallback, useState } from 'react';
import { ColorPickerCompact } from './ColorPickerCompact';
import { ColorPickerFull } from './ColorPickerFull';
import { useColorPickerBaseSwatch } from './hooks/use-color-picker-base-swatch';
import { useColorPickerBaseValue } from './hooks/use-color-picker-base-value';

const commonColors = [
  '#00000000', // Transparent
  '#000000', // Black
  '#FFFFFF', // White
  '#808080', // Gray
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#00FFFF', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#A52A2A', // Brown
];
const DEFAULT_COLOR = '#000000';

const ColorPickerBase: React.FC<ColorPickerBaseProps> = (props) => {
  const {
    value: propValue,
    onChange,
    onValueChange,
    layout = 'full',
    presetColors,
    format,
    defaultFormat = 'hex',
    onFormatChange,
    children,
    ...rest
  } = props;

  const { currentValue, handleValueChange } = useColorPickerBaseValue({
    value: propValue,
    defaultValue: DEFAULT_COLOR,
    onChange,
    onValueChange,
  });

  const { valueForPicker, handleFormatChange, handleSwatchSelect } =
    useColorPickerBaseSwatch({
      currentValue,
      format,
      defaultFormat,
      onFormatChange,
      handleValueChange,
    });

  const [open, setOpen] = useState<boolean>(false);

  let colors = presetColors || commonColors;

  const handleOpen = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  if (layout === 'compact' && !presetColors) {
    colors = colors.slice(0, -1);
  }

  return (
    <ColorPicker
      {...rest}
      format={format}
      defaultFormat={defaultFormat}
      onFormatChange={handleFormatChange}
      value={valueForPicker}
      onValueChange={handleValueChange}
      onOpenChange={handleOpen}
    >
      <ColorPickerTrigger
        asChild
        className="w-full flex items-center gap-1 border border-input bg-background px-3 py-2 rounded-md "
      >
        {children({
          value: currentValue,
          onValueChange: handleValueChange,
          isPickerOpen: open,
        })}
      </ColorPickerTrigger>
      {layout === 'compact' ? (
        <ColorPickerCompact
          onValueChange={handleSwatchSelect}
          layout={layout}
          presetColors={colors}
        />
      ) : (
        <ColorPickerFull
          onValueChange={handleSwatchSelect}
          layout={layout}
          presetColors={colors}
        />
      )}
    </ColorPicker>
  );
};

ColorPickerBase.displayName = 'ColorPickerBase';

export { ColorPickerBase };
