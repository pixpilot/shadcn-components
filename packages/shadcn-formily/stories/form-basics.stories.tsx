/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, JsonSchemaFormBasic, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Basic Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const JSON_INDENT = 2;

export const WithJSONSchema: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        bio: {
          type: 'string',
          title: 'Bio',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Tell us about yourself',
          },
        },
      },
    };

    return (
      <Form
        id="form-basics"
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          id="form-basics-button-1"
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const WithPropNameAsLabel: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        bio: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Tell us about yourself',
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
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          id="form-basics-button-2"
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const WithEmptyTitle = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          title: '',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          required: true,
          title: false,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
      },
    };

    return (
      <JsonSchemaFormBasic
        schema={schema}
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <button
          id="form-basics-button-3"
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </JsonSchemaFormBasic>
    );
  },
};
