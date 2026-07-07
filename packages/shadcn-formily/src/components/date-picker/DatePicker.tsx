'use client';

import type { DatePickerProps as ShadcnDatePickerProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { DatePicker as ShadcnDatePicker } from '@pixpilot/shadcn-ui';

export type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
} & Omit<ShadcnDatePickerProps, 'selected' | 'onSelect' | 'mode'>;

/**
 * Formily-connected Date Picker component
 * Displays a date picker with calendar popup
 */
function BaseDatePicker(props: DatePickerProps) {
  return <ShadcnDatePicker {...props} />;
}

export const DatePicker = connect(BaseDatePicker, mapProps());
