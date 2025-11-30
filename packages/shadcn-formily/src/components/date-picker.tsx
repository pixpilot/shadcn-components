'use client';

import type { ComponentProps } from 'react';
import { connect, mapProps } from '@formily/react';
import { DatePicker as ShadcnDatePicker } from '@pixpilot/shadcn-ui';

type BaseDatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
} & Omit<ComponentProps<typeof ShadcnDatePicker>, 'selected' | 'onSelect' | 'mode'>;

/**
 * Formily-connected Date Picker component
 * Displays a date picker with calendar popup
 */
function BaseDatePicker(props: BaseDatePickerProps) {
  return <ShadcnDatePicker {...props} />;
}

export const DatePicker = connect(BaseDatePicker, mapProps());
