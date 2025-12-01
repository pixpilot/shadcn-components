'use client';

import type { ComponentProps } from 'react';
import type { CommandOptionListItem } from './CommandOptionList';

import {
  Button,
  Command,
  CommandInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@internal/shadcn';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';
import { CommandOptionList } from './CommandOptionList';

type ComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  options?: CommandOptionListItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
} & Omit<ComponentProps<typeof Command>, 'value' | 'onValueChange'>;

const DEFAULT_OPTIONS: CommandOptionListItem[] = [];

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
      <PopoverContent
        className="w-full p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command {...commandProps}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandOptionList
            options={options}
            value={value}
            onChange={(val) => {
              // eslint-disable-next-line ts/no-unsafe-argument
              onChange?.(val);
              setOpen(false);
            }}
            emptyText={emptyText}
          ></CommandOptionList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
