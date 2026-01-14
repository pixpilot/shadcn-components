'use client';

import type { ColorPickerBaseProps, ColorPickerBaseSection, PresetColor } from './types';
import { ColorPicker, ColorPickerTrigger } from '@pixpilot/shadcn';
import { useCallback, useState } from 'react';
import { ColorPickerCompact } from './ColorPickerCompact';
import { ColorPickerFull } from './ColorPickerFull';
import { useColorPickerBaseSwatch } from './hooks/use-color-picker-base-swatch';
import { useColorPickerBaseValue } from './hooks/use-color-picker-base-value';

const commonColors: PresetColor[] = [
  { label: 'Transparent', value: '#00000000' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Gray', value: '#808080' },
  { label: 'Red', value: '#FF0000' },
  { label: 'Orange', value: '#FFA500' },
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Lime', value: '#84CC16' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Cyan', value: '#00FFFF' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Brown', value: '#A52A2A' },
];
const DEFAULT_COLOR = '#000000';

const DEFAULT_SECTIONS = ['swatch', 'picker', 'format-select', 'input'] as const;

const ColorPickerBase: React.FC<ColorPickerBaseProps> = (props) => {
  const {
    value: propValue,
    onChange,
    onValueChange,
    layout = 'full',
    presetColors,
    sections,
    format,
    defaultFormat = 'hex',
    onFormatChange,
    contentProps,
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

  const resolvedSections = (sections ??
    DEFAULT_SECTIONS) as ReadonlyArray<ColorPickerBaseSection>;

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
          {...contentProps}
          onValueChange={handleSwatchSelect}
          presetColors={colors}
          sections={resolvedSections}
          currentValue={currentValue}
        />
      ) : (
        <ColorPickerFull
          {...contentProps}
          onValueChange={handleSwatchSelect}
          presetColors={colors}
          sections={resolvedSections}
          currentValue={currentValue}
        />
      )}
    </ColorPicker>
  );
};

ColorPickerBase.displayName = 'ColorPickerBase';

export { ColorPickerBase };
