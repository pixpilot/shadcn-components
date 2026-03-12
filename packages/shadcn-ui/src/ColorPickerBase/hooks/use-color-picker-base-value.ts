import { useControlled } from '@internal/hooks';
import { useCallback, useEffect, useRef } from 'react';

export function useColorPickerBaseValue(params: {
  value: string | undefined;
  defaultValue: string;
  onChange: ((value: string) => void) | undefined;
  onValueChange: ((value: string) => void) | undefined;
}): {
  currentValue: string;
  handleValueChange: (value: string) => void;
} {
  const { value: propValue, defaultValue, onChange, onValueChange } = params;

  const [currentValue, setCurrentValue] = useControlled({
    controlled: propValue,
    default: defaultValue,
    name: 'ColorPickerBase',
    state: 'value',
  });

  /**
   * Prevent "Maximum update depth exceeded" in controlled mode.
   *
   * The underlying @pixpilot/shadcn ColorPicker calls onValueChange inside a layout-effect
   * when syncing a controlled 'value' prop (it calls both store.setColor() and store.setHsv(),
   * each of which emits onValueChange). This can create a feedback loop if the parent
   * re-renders and passes back the same normalized value, causing infinite re-renders
   * during fast pointer moves.
   */
  const isApplyingControlledValueRef = useRef(false);
  const lastPropValueRef = useRef(propValue);
  const lastNotifiedValueRef = useRef<string | undefined>(undefined);

  if (propValue !== lastPropValueRef.current) {
    lastPropValueRef.current = propValue;
    isApplyingControlledValueRef.current = true;
    /*
     * Reset the last-notified sentinel whenever the controlled value changes
     * from the outside (e.g. form.setValues()). Without this reset, a user who
     * previously selected "#FFA500", then had the value externally changed to
     * "#EF4444", would be unable to re-select "#FFA500" because
     * lastNotifiedValueRef still holds "#FFA500" and the dedup guard would
     * silently swallow the onChange/onValueChange call.
     */
    lastNotifiedValueRef.current = undefined;
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

  return {
    currentValue,
    handleValueChange,
  };
}
