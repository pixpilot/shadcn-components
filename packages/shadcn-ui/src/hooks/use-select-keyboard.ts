import React from 'react';

interface UseSelectKeyboardProps<T> {
  options?: T[];
  value: string;
  onChange?: (value: string) => void;
  keyboardMode?: 'cycle' | 'dropdown';
  open: boolean;
  getValue: (option: T) => string;
}

/**
 * Hook to handle keyboard navigation for select components
 * Supports cycling through options with arrow keys when closed
 */
export function useSelectKeyboard<T>({
  options,
  value,
  onChange,
  keyboardMode = 'dropdown',
  open,
  getValue,
}: UseSelectKeyboardProps<T>): {
  handleTriggerKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
} {
  const handleTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyboardMode !== 'cycle') {
        return;
      }

      if (open) {
        return;
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!options || options.length === 0) {
        return;
      }

      const currentIndex = options.findIndex((option) => getValue(option) === value);
      const optionCount = options.length;

      let nextIndex = 0;
      if (event.key === 'ArrowDown') {
        nextIndex = currentIndex >= 0 ? (currentIndex + 1) % optionCount : 0;
      } else {
        nextIndex =
          currentIndex >= 0
            ? (currentIndex - 1 + optionCount) % optionCount
            : optionCount - 1;
      }

      const nextValue = getValue(options[nextIndex] as T);
      if (!nextValue || nextValue === value) {
        return;
      }

      onChange?.(nextValue);
    },
    [keyboardMode, open, options, value, onChange, getValue],
  );

  return { handleTriggerKeyDown };
}
