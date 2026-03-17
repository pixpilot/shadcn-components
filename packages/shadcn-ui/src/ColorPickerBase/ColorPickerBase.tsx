'use client';

import type { ColorPickerBaseProps, ColorPickerBaseSection } from './types';
import { useCallback, useState } from 'react';
import { COMMON_COLORS } from './color-palette';
import { ColorPickerCompactControls } from './ColorPickerCompactControls';
import { ColorPickerFullControls } from './ColorPickerFullControls';
import { ColorPickerRoot } from './ColorPickerRoot';
import { DEFAULT_COLOR, DEFAULT_SECTIONS } from './constants';
import { useColorPickerValueAdapter } from './hooks/use-color-picker-base-swatch';
import { useColorPickerBaseValue } from './hooks/use-color-picker-base-value';

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

  const { valueForPicker, handleFormatChange } = useColorPickerValueAdapter({
    currentValue,
    format,
    defaultFormat,
    onFormatChange,
    handleValueChange,
  });

  const [open, setOpen] = useState<boolean>(false);

  const resolvedSections = (sections ??
    DEFAULT_SECTIONS) as ReadonlyArray<ColorPickerBaseSection>;

  let colors = presetColors || COMMON_COLORS;

  const handleOpen = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  if (layout === 'compact' && !presetColors) {
    colors = colors.slice(0, -1);
  }

  return (
    <ColorPickerRoot
      {...rest}
      format={format}
      defaultFormat={defaultFormat}
      onFormatChange={handleFormatChange}
      value={valueForPicker}
      onValueChange={handleValueChange}
      onOpenChange={handleOpen}
    >
      {typeof children === 'function'
        ? children({
            value: currentValue,
            onValueChange: handleValueChange,
            isPickerOpen: open,
          })
        : children}

      {layout === 'compact' ? (
        <ColorPickerCompactControls
          {...contentProps}
          presetColors={colors}
          sections={resolvedSections}
        />
      ) : (
        <ColorPickerFullControls
          {...contentProps}
          presetColors={colors}
          sections={resolvedSections}
        />
      )}
    </ColorPickerRoot>
  );
};

ColorPickerBase.displayName = 'ColorPickerBase';

export { ColorPickerBase };
