import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from '../src/DatePicker';

/**
 * A date picker component with calendar popover.
 * Allows users to select a date from a calendar interface.
 */
const meta = {
  title: 'shadcn-ui/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default date picker
 */
export const Default: Story = {
  args: {
    placeholder: 'Pick a date',
  },
  render: function DefaultDatePicker(args) {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

/**
 * Date picker with pre-selected date
 */
export const WithValue: Story = {
  args: {
    placeholder: 'Select date',
  },
  render: function WithValueDatePicker(args) {
    const [date, setDate] = useState<Date | undefined>(() => new Date());

    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};
