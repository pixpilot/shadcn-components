import type { ColorPickerResetOptions } from '../types';

import { capitalize } from '@pixpilot/string';
import React from 'react';
import { useColorPickerContext } from '../color-picker-context';

export interface UseColorPickerResetOptionsParams {
  resetOptions?: ColorPickerResetOptions;
  onClear?: () => void;
}

export function useColorPickerResetOptions(params: UseColorPickerResetOptionsParams): {
  value: string;
  isResettable: boolean;
  isResetValue: boolean;
  resetLabel: string;
  resetTooltip: string;
  resetIcon: React.ReactNode;
  handleClear?: () => void;
  showClearButton: boolean;
  currentcolor?: string;
} {
  const { resetOptions, onClear } = params;
  const { value, onValueChange } = useColorPickerContext();

  const isResettable = resetOptions != null;
  const isResetValue = value === resetOptions?.value;
  const resetLabel = resetOptions?.label ?? capitalize(resetOptions?.value ?? '');
  const resetIcon = resetOptions?.icon;
  const resetTooltip = resetOptions?.tooltip ?? capitalize(resetLabel);
  const currentcolor = !isResetValue && value != null && value !== '' ? value : undefined;
  const handleReset = React.useCallback(() => {
    if (resetOptions != null) {
      onValueChange(resetOptions.value);
    }
  }, [onValueChange, resetOptions]);

  const handleClear = onClear ?? (isResettable ? handleReset : undefined);
  const showClearButton =
    handleClear != null && (onClear != null || isResetValue === false);

  return {
    value,
    isResettable,
    isResetValue,
    resetLabel,
    resetTooltip,
    resetIcon,
    handleClear,
    showClearButton,
    currentcolor,
  };
}
