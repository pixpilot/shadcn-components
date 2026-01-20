/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const INDENT_SIZE = 2;

const meta: Meta<typeof Form> = {
  title: 'Formily/FormItem/Label',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicLabel: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          title: 'Email Address',
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

export const RequiredLabel: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your first name',
          },
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your last name',
          },
        },
        bio: {
          type: 'string',
          title: 'Bio',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Tell us about yourself (optional)',
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

export const RequiredArrayLabel: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      required: ['firstName', 'lastName'],
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your first name',
          },
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your last name',
          },
        },
        bio: {
          type: 'string',
          title: 'Bio',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Tell us about yourself (optional)',
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

export const LabelPlacementTop: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username (Top)',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            slots: {
              label: {
                placement: 'top',
              },
            },
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Label above input',
          },
        },
      },
    };

    return (
      <Form form={form} className="w-[400px]">
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

export const LabelPlacementStart: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username (Start)',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            slots: {
              label: {
                placement: 'start',
              },
            },
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Label on the left',
          },
        },
        email: {
          type: 'string',
          title: 'Email (Start)',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            slots: {
              label: {
                placement: 'start',
              },
            },
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Label on the left',
            type: 'email',
          },
        },
      },
    };

    return (
      <Form form={form} className="w-[500px]">
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

export const LabelPlacementEnd: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        agree: {
          type: 'boolean',
          title: 'I agree to the terms',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            slots: {
              label: {
                placement: 'end',
              },
            },
          },
          'x-component': 'Checkbox',
        },
        subscribe: {
          type: 'boolean',
          title: 'Subscribe to newsletter',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            slots: {
              label: {
                placement: 'end',
              },
            },
          },
          'x-component': 'Checkbox',
        },
      },
    };

    return (
      <Form form={form} className="w-[400px]">
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

export const CustomLabelViaProps: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, INDENT_SIZE));
        }}
      >
        <SchemaField.String
          name="username"
          title="Default Title"
          x-decorator="FormItem"
          x-decorator-props={{
            label: 'Custom Label (from props)',
          }}
          x-component="Input"
          x-component-props={{
            placeholder: 'Props override schema title',
          }}
        />
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
