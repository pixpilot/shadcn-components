import type { ComponentMeta } from '@internal/mcp';
import type { Calendar } from '@pixpilot/shadcn';
import type { ComponentProps } from 'react';
import type { DatePickerProps } from './DatePicker';
import { defineProps } from '@internal/mcp';

// DatePicker forwards every react-day-picker Calendar prop, so document only the
// wrapper's OWN props here (the rest are noted as forwarded). This is still
// derived from `DatePickerProps`: a newly added DatePicker-specific prop is a
// compile error until documented, while the forwarded Calendar keys are excluded
// so we do not re-document the entire calendar library. `id` overlaps a Calendar
// prop name but is a first-class DatePicker prop, so it is kept.
type ForwardedCalendarKeys = Exclude<keyof ComponentProps<typeof Calendar>, 'id'>;
type DatePickerDocumentedProps = Exclude<
  Extract<keyof DatePickerProps, string>,
  ForwardedCalendarKeys
>;

export const meta: ComponentMeta<DatePickerDocumentedProps> = {
  name: 'DatePicker',
  category: 'Forms',
  description:
    'A single-date picker with a calendar popover trigger and an optional inline clear button.',
  props: defineProps<DatePickerDocumentedProps>({
    id: 'Optional id attribute applied to the trigger and calendar.',
    value: {
      description: 'Controlled selected date.',
      type: 'Date',
    },
    onChange: {
      description: 'Called with the selected Date, or undefined when cleared.',
      type: '(date: Date | undefined) => void',
    },
    placeholder: {
      description: 'Text shown on the trigger before a date is selected.',
      type: 'string',
      defaultValue: '"Pick a date"',
    },
    showClearButton: {
      description: 'Shows a clear button when a date is selected.',
      type: 'boolean',
      defaultValue: 'true',
    },
  }),
  notes: [
    'Forwards all react-day-picker Calendar props (e.g. numberOfMonths, showOutsideDays, disabled, captionLayout, fixedWeeks, weekStartsOn) except selected/onSelect/mode, which the wrapper manages.',
  ],
  examples: [
    {
      title: 'Date picker',
      code: '<DatePicker value={date} onChange={setDate} />',
    },
  ],
  keywords: ['date', 'calendar', 'picker', 'form'],
};
