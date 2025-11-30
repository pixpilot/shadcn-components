/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/DatePicker',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicDatePicker: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        birthDate: {
          type: 'string',
          title: 'Date of Birth',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: 'Select your date of birth',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const MultipleDatePickers: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          title: 'Start Date',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: 'Select start date',
          },
        },
        endDate: {
          type: 'string',
          title: 'End Date',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: 'Select end date',
          },
        },
        meetingDate: {
          type: 'string',
          title: 'Meeting Date',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: 'Select meeting date',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const DeclarativeDatePicker: Story = {
  render: () => {
    const form = createForm({
      values: {
        eventDate: new Date('2025-12-25'),
      },
    });

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField>
          <SchemaField.String
            name="eventDate"
            title="Event Date"
            required
            x-decorator="FormItem"
            x-component="DatePicker"
            x-component-props={{
              placeholder: 'Select event date',
            }}
          />
          <SchemaField.String
            name="reminderDate"
            title="Reminder Date"
            x-decorator="FormItem"
            x-component="DatePicker"
            x-component-props={{
              placeholder: 'Select reminder date',
            }}
          />
        </SchemaField>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};
