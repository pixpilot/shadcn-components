'use client';

import type { ComponentProps } from 'react';
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@internal/shadcn';

import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

type ComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  options?: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
} & Omit<ComponentProps<typeof Command>, 'value' | 'onValueChange'>;

const DEFAULT_OPTIONS: Option[] = [];

const Combobox: React.FC<ComboboxProps> = (props) => {
  const {
    value = '',
    onChange,
    options = DEFAULT_OPTIONS,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No option found.',
    ...commandProps
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? options.find((option) => option.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command {...commandProps}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
