'use client';

import type { ComponentProps } from 'react';
import {
  Button,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixpilot/shadcn';

import { CalendarIcon, XIcon } from 'lucide-react';

import React from 'react';

export type DatePickerProps = {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  showClearButton?: boolean;
} & Omit<ComponentProps<typeof Calendar>, 'selected' | 'onSelect' | 'mode'>;

export function DatePicker(props: DatePickerProps) {
  const {
    id,
    value,
    onChange,
    placeholder = 'Pick a date',
    showClearButton = true,
    ...calendarProps
  } = props;

  return (
    <div className="relative flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              showClearButton && value && 'pr-8',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? value.toLocaleDateString() : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
      {showClearButton && value && (
        <button
          type="button"
          onClick={() => onChange?.(undefined)}
          className="absolute right-2 text-muted-foreground hover:text-foreground"
          aria-label="Clear date"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

DatePicker.displayName = 'DatePicker';
