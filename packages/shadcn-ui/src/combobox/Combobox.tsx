'use client';

import type { ComponentProps } from 'react';
import type { CommandOptionListItem } from '../command-option-list';

import {
  Button,
  cn,
  Command,
  CommandInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixpilot/shadcn';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';
import { CommandOptionList } from '../command-option-list';
import { getId } from '../utils';

interface ComboboxProps extends Omit<React.ComponentProps<typeof Button>, 'onChange'> {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: CommandOptionListItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Styles the visible trigger button. */
  className?: string;
  /** Props forwarded to the underlying cmdk `Command` root. */
  commandProps?: ComponentProps<typeof Command>;
}

const DEFAULT_OPTIONS: CommandOptionListItem[] = [];

const Combobox: React.FC<ComboboxProps> = (props) => {
  const {
    value = '',
    onChange,
    options = DEFAULT_OPTIONS,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No option found.',
    id,
    className,
    commandProps,
    variant = 'outline',
    ...buttonProps
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...buttonProps}
          id={id}
          variant={variant}
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
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
          <CommandInput id={getId(id, 'search-input')} placeholder={searchPlaceholder} />
          <CommandOptionList
            id={id}
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
export type { ComboboxProps };
