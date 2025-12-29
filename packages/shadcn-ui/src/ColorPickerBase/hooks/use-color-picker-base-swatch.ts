import type { ColorPickerBaseFormat } from '../utils/color-picker-base-utils';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  getSwatchSelectionResult,
  toPickerValue,
} from '../utils/color-picker-base-utils';

export function useColorPickerBaseSwatch(params: {
  currentValue: string;
  format: ColorPickerBaseFormat | undefined;
  defaultFormat: ColorPickerBaseFormat;
  onFormatChange: ((format: ColorPickerBaseFormat) => void) | undefined;
  handleValueChange: (value: string) => void;
}): {
  valueForPicker: string;
  handleFormatChange: (format: ColorPickerBaseFormat) => void;
  handleSwatchSelect: (value: string) => void;
} {
  const { currentValue, format, defaultFormat, onFormatChange, handleValueChange } =
    params;

  const currentFormatRef = useRef<ColorPickerBaseFormat>(format ?? defaultFormat);
  if (format !== undefined) {
    currentFormatRef.current = format;
  }

  const [forceOpaqueHex, setForceOpaqueHex] = useState<string | null>(null);

  const handleFormatChange = useCallback(
    (nextFormat: ColorPickerBaseFormat) => {
      currentFormatRef.current = nextFormat;
      onFormatChange?.(nextFormat);
    },
    [onFormatChange],
  );

  const handleSwatchSelect = useCallback(
    (value: string) => {
      const desiredFormat = currentFormatRef.current;
      const result = getSwatchSelectionResult({
        swatchValue: value,
        desiredFormat,
      });

      if (result.forceOpaqueHex !== null) {
        setForceOpaqueHex(result.forceOpaqueHex);
      }

      handleValueChange(result.value);
    },
    [handleValueChange],
  );

  useLayoutEffect(() => {
    if (forceOpaqueHex === null) return;
    if (currentValue.trim().toLowerCase() === forceOpaqueHex) {
      setForceOpaqueHex(null);
    }
  }, [currentValue, forceOpaqueHex]);

  const valueForPicker = toPickerValue({
    currentValue,
    currentFormat: currentFormatRef.current,
    forceOpaqueHex,
  });

  return {
    valueForPicker,
    handleFormatChange,
    handleSwatchSelect,
  };
}
