/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const INDENT_SIZE = 2;

const meta: Meta<typeof Form> = {
  title: 'Formily/Validation',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const SimpleInputValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          title: 'Email',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
          'x-validator': [
            {
              required: true,
              message: 'Email is required',
            },
            {
              pattern: /^[^@]+@[^@]+$/u,
              message: 'Please enter a valid email address',
            },
          ],
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, INDENT_SIZE));
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
