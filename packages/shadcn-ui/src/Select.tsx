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
} & Omit<ComponentProps<typeof ShadcnSelect>, 'value' | 'onValueChange' | 'children'>;

function Select(props: BaseSelectProps) {
  const {
    options,
    value = '',
    onChange,
    placeholder,
    contentProps,
    ...restProps
  } = props;

  return (
    <ShadcnSelect value={value} onValueChange={onChange} {...restProps}>
      <SelectTrigger className="w-full">
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
