import type { ComponentProps } from 'react';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import React from 'react';

import { useSelectKeyboard } from './hooks/use-select-keyboard';

export interface SelectOption {
  value: string | number;
  label: string;
}

export type SelectContentProps = React.ComponentProps<typeof SelectContent>;

type BaseSelectProps = {
  /**
   * Array of options to display in the select dropdown
   */
  options?: SelectOption[];
  /**
   * Additional props to pass to the SelectContent component
   */
  contentProps?: SelectContentProps;
  /**
   * The currently selected value
   */
  value?: string;
  /**
   * Callback function called when the selected value changes
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder text to display when no value is selected
   */
  placeholder?: string;
  /**
   * Keyboard navigation mode
   * - "cycle": Cycles through options with arrow keys
   * - "dropdown": Opens dropdown on arrow keys
   */
  keyboardMode?: 'cycle' | 'dropdown';
  /**
   * Controls how the dropdown is positioned
   * - "item-aligned": Aligns with the trigger button
   * - "popper": Uses floating-ui positioning
   */
  position?: SelectContentProps['position'];
  /**
   * Whether to show a clear button when a value is selected
   */
  clearable?: boolean;
} & Omit<ComponentProps<typeof ShadcnSelect>, 'value' | 'onValueChange' | 'children'>;

function Select(props: BaseSelectProps) {
  const {
    options,
    value = '',
    onChange,
    placeholder,
    contentProps,
    keyboardMode = 'dropdown',
    open: openProp,
    onOpenChange: onOpenChangeProp,
    position,
    clearable = false,
    ...restProps
  } = props;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp === undefined) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChangeProp?.(nextOpen);
  };

  const { handleTriggerKeyDown } = useSelectKeyboard({
    options,
    value,
    onChange,
    keyboardMode,
    open,
    getValue: (option) => String(option.value),
  });

  return (
    <ShadcnSelect
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={handleOpenChange}
      {...restProps}
    >
      <SelectTrigger className="w-full" onKeyDown={handleTriggerKeyDown}>
        <div className="flex items-center justify-between gap-2 flex-1 w-full min-w-0">
          <span className="flex-1 truncate text-left">
            <SelectValue placeholder={placeholder} />
          </span>

          {clearable && value !== '' && (
            <button
              type="button"
              /* ml-auto ensures it sticks to the right if flex-1 above fails,
           but justify-between handles it mostly. */
              className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-sm opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange?.('');
                handleOpenChange(false);
              }}
              aria-label="Clear selection"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </SelectTrigger>

      <SelectContent position={position} {...contentProps}>
        {options?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}

export { Select };
