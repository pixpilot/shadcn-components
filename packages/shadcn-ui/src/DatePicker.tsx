'use client';

import type { ComponentProps } from 'react';
import {
  Button,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@internal/shadcn';

import { CalendarIcon } from 'lucide-react';

import React from 'react';

type BaseDatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
} & Omit<ComponentProps<typeof Calendar>, 'selected' | 'onSelect' | 'mode'>;

export function DatePicker(props: BaseDatePickerProps) {
  const { value, onChange, placeholder = 'Pick a date', ...calendarProps } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
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
  );
}

DatePicker.displayName = 'DatePicker';
