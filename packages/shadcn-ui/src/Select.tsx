import type { ComponentProps } from 'react';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@pixpilot/shadcn';
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
        <SelectValue placeholder={placeholder} />
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
