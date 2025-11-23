import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Form Grid',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const GridLayout: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 3 },
      properties: {
        field1: {
          type: 'string',
          title: 'Field 1 (Span 2)',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 2 },
          'x-component': 'Input',
        },
        field2: {
          type: 'string',
          title: 'Field 2',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field3: {
          type: 'string',
          title: 'Field 3',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field4: {
          type: 'string',
          title: 'Field 4',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field5: {
          type: 'string',
          title: 'Field 5 (Span 3)',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 3 },
          'x-component': 'Textarea',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[800px]"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </Form>
    );
  },
};
