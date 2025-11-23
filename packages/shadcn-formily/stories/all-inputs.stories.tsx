import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/All Inputs',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const AllInputTypes: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        textInput: {
          type: 'string',
          title: 'Text Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter text',
          },
        },
        numberInput: {
          type: 'number',
          title: 'Number Input',
          'x-decorator': 'FormItem',
          'x-component': 'NumberInput',
        },
        textarea: {
          type: 'string',
          title: 'Textarea',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Enter long text',
          },
        },
        checkbox: {
          type: 'boolean',
          title: 'Checkbox',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        radio: {
          type: 'string',
          title: 'Radio Group',
          'x-decorator': 'FormItem',
          'x-component': 'Radio',
          'x-component-props': {
            options: [
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },
            ],
          },
        },
        select: {
          type: 'string',
          title: 'Select',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              { label: 'Choice A', value: 'a' },
              { label: 'Choice B', value: 'b' },
              { label: 'Choice C', value: 'c' },
            ],
            placeholder: 'Select an option',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, 2));
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
