'use client';

import type { ColorPickerRootProps } from './types';
import { ColorPicker } from '@pixpilot/shadcn';
import { useState } from 'react';

import { ColorPickerContextContextProvider } from './color-picker-context';
import { useColorPickerValueAdapter } from './hooks/use-color-picker-base-swatch';
import { useColorPickerBaseValue } from './hooks/use-color-picker-base-value';

const DEFAULT_COLOR = '#000000';

const ColorPickerRoot: React.FC<ColorPickerRootProps> = (props) => {
  const {
    value: propValue,
    onChange,
    onValueChange,
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

  const { valueForPicker, handleFormatChange } = useColorPickerValueAdapter({
    currentValue,
    format,
    defaultFormat,
    onFormatChange,
    handleValueChange,
  });

  const [open, setOpen] = useState<boolean>(false);

  return (
    <ColorPickerContextContextProvider
      value={{
        isPickerOpen: open,
        value: currentValue,
        onValueChange: handleValueChange,
        openPicker: setOpen,
      }}
    >
      <ColorPicker
        {...rest}
        format={format}
        defaultFormat={defaultFormat}
        onFormatChange={handleFormatChange}
        value={valueForPicker}
        onValueChange={handleValueChange}
        onOpenChange={setOpen}
      >
        {children}
      </ColorPicker>
    </ColorPickerContextContextProvider>
  );
};

ColorPickerRoot.displayName = 'ColorPickerRoot';

export { ColorPickerRoot };
