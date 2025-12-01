import type { ComponentProps } from 'react';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@internal/shadcn';
import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

type BaseSelectProps = {
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
} & Omit<ComponentProps<typeof ShadcnSelect>, 'value' | 'onValueChange' | 'children'>;

function Select(props: BaseSelectProps) {
  const { options, value = '', onChange, placeholder, ...restProps } = props;

  return (
    <ShadcnSelect value={value} onValueChange={onChange} {...restProps}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
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
