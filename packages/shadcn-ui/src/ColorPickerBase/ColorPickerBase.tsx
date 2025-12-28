'use client';

import type { ColorPickerBaseProps } from './types';
import { useControlled } from '@internal/hooks';
import { ColorPicker, ColorPickerTrigger } from '@pixpilot/shadcn';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ColorPickerCompact } from './ColorPickerCompact';
import { ColorPickerFull } from './ColorPickerFull';

const commonColors = [
  'transparent',
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
    children,
    ...rest
  } = props;

  const [currentValue, setCurrentValue] = useControlled({
    controlled: propValue,
    default: DEFAULT_COLOR,
    name: 'ColorPickerBase',
    state: 'value',
  });

  const [open, setOpen] = useState<boolean>(false);

  /**
   * Prevent "Maximum update depth exceeded" in controlled mode.
   *
   * The underlying @pixpilot/shadcn ColorPicker calls onValueChange inside a layout-effect
   * when syncing a controlled 'value' prop (it calls both store.setColor() and store.setHsv(),
   * each of which emits onValueChange). This can create a feedback loop if the parent
   * re-renders and passes back the same normalized value, causing infinite re-renders
   * during fast pointer moves.
   *
   * We guard against this by:
   * - Ignoring onValueChange events that occur immediately after a prop change.
   * - Deduping repeated notifications of the same value.
   */
  const isApplyingControlledValueRef = useRef(false);
  const lastPropValueRef = useRef(propValue);
  const lastNotifiedValueRef = useRef<string | undefined>(undefined);

  if (propValue !== lastPropValueRef.current) {
    lastPropValueRef.current = propValue;
    isApplyingControlledValueRef.current = true;
  }

  useEffect(() => {
    isApplyingControlledValueRef.current = false;
  }, [propValue]);

  const handleValueChange = useCallback(
    (value: string) => {
      if (isApplyingControlledValueRef.current) return;

      if (lastNotifiedValueRef.current === value) {
        setCurrentValue(value);
        return;
      }

      setCurrentValue(value);
      onChange?.(value);
      onValueChange?.(value);
      lastNotifiedValueRef.current = value;
    },
    [setCurrentValue, onChange, onValueChange],
  );

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
      value={currentValue}
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
          onValueChange={handleValueChange}
          layout={layout}
          presetColors={colors}
        />
      ) : (
        <ColorPickerFull
          onValueChange={handleValueChange}
          layout={layout}
          presetColors={colors}
        />
      )}
    </ColorPicker>
  );
};

ColorPickerBase.displayName = 'ColorPickerBase';

export { ColorPickerBase };
