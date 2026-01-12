import type { ComponentProps } from 'react';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@pixpilot/shadcn';
import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

type BaseSelectProps = {
  options?: SelectOption[];
  contentProps?: React.ComponentProps<typeof SelectContent>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  keyboardMode?: 'cycle' | 'dropdown';
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

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
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

    const currentIndex = options.findIndex((option) => String(option.value) === value);
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

    const nextValue = String(options[nextIndex]?.value ?? '');
    if (!nextValue || nextValue === value) {
      return;
    }

    onChange?.(nextValue);
  };

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
      <SelectContent {...contentProps}>
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
