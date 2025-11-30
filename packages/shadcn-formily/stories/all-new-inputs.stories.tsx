/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/All New Inputs',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const AllNewComponents: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        // Date Picker
        eventDate: {
          type: 'string',
          title: 'Event Date',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: 'Select event date',
          },
        },
        // Combobox
        framework: {
          type: 'string',
          title: 'Framework',
          'x-decorator': 'FormItem',
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Select framework...',
            searchPlaceholder: 'Search framework...',
            options: [
              { label: 'Next.js', value: 'nextjs' },
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
            ],
          },
        },
        // Separator
        separator1: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        // Slider
        volume: {
          type: 'number',
          title: 'Volume',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [50],
            max: 100,
            step: 1,
          },
        },
        // Switch
        notifications: {
          type: 'boolean',
          title: 'Enable Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All New Input Components</h3>
          <SchemaField schema={schema} />
        </div>
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

export const DeclarativeAllNewComponents: Story = {
  render: () => {
    const form = createForm({
      values: {
        eventDate: new Date('2025-12-31'),
        framework: 'react',
        volume: 75,
        notifications: true,
      },
    });

    const frameworks = [
      { label: 'Next.js', value: 'nextjs' },
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
    ];

    const MAX_VOLUME = 100;

    return (
      <Form
        form={form}
        className="w-[500px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Project Configuration</h3>

          <SchemaField>
            <SchemaField.Void
              x-component="div"
              x-component-props={{
                className: 'mb-2 text-sm font-medium text-muted-foreground',
                children: 'Event Details',
              }}
            />
            <SchemaField.Void
              x-component="Separator"
              x-component-props={{
                className: 'mb-4',
              }}
            />

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
              name="framework"
              title="Framework"
              required
              x-decorator="FormItem"
              x-component="Combobox"
              x-component-props={{
                placeholder: 'Select framework...',
                searchPlaceholder: 'Search framework...',
                options: frameworks,
              }}
            />

            <SchemaField.Void
              x-component="div"
              x-component-props={{
                className: 'mb-2 mt-6 text-sm font-medium text-muted-foreground',
                children: 'Settings',
              }}
            />
            <SchemaField.Void
              x-component="Separator"
              x-component-props={{
                className: 'mb-4',
              }}
            />

            <SchemaField.Number
              name="volume"
              title="Volume"
              x-decorator="FormItem"
              x-component="Slider"
              x-component-props={{
                defaultValue: [75],
                max: MAX_VOLUME,
                step: 5,
              }}
            />

            <SchemaField.Boolean
              name="notifications"
              title="Enable Notifications"
              x-decorator="FormItem"
              x-component="Switch"
            />

            <SchemaField.Boolean
              name="autoSave"
              title="Auto Save"
              x-decorator="FormItem"
              x-component="Switch"
            />
          </SchemaField>
        </div>
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
