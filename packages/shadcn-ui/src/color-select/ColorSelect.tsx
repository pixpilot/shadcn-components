import type { ComponentProps } from 'react';

import {
  cn,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@pixpilot/shadcn';
import React from 'react';

import { useSelectKeyboard } from '../hooks/use-select-keyboard';
import { getId } from '../utils';

export interface ColorSelectOption {
  label: string;
  value: string;
}

type BaseColorSelectProps = {
  id?: string;
  options?: ColorSelectOption[];
  contentProps?: React.ComponentProps<typeof SelectContent>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  keyboardMode?: 'cycle' | 'dropdown';
  className?: string;
} & Omit<ComponentProps<typeof ShadcnSelect>, 'value' | 'onValueChange' | 'children'>;

function ColorSelect(props: BaseColorSelectProps) {
  const {
    options,
    value = '',
    onChange,
    placeholder,
    contentProps,
    keyboardMode = 'dropdown',
    open: openProp,
    onOpenChange: onOpenChangeProp,
    id,
    className,
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
    getValue: (option) => option.value,
  });

  const selectedOption = options?.find((option) => option.value === value);

  return (
    <ShadcnSelect
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={handleOpenChange}
      {...restProps}
    >
      <SelectTrigger
        id={id}
        className={cn('w-full', className)}
        onKeyDown={handleTriggerKeyDown}
      >
        <SelectValue placeholder={placeholder}>
          {selectedOption && (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border border-gray-300"
                style={{ backgroundColor: selectedOption.value }}
              />
              <span>{selectedOption.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            id={getId(id, `option-${option.value}`)}
            value={option.value}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border border-gray-300"
                style={{ backgroundColor: option.value }}
              />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}

export { ColorSelect };
export type { BaseColorSelectProps as ColorSelectProps };
