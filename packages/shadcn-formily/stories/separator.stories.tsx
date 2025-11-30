/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Separator',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const HorizontalSeparator: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter first name',
          },
        },
        separator1: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter last name',
          },
        },
        separator2: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter email',
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

export const WithSectionHeaders: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        personalInfo: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            className: 'mb-2 text-lg font-semibold',
            children: 'Personal Information',
          },
        },
        separator1: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'mb-4',
          },
        },
        firstName: {
          type: 'string',
          title: 'First Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        contactInfo: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            className: 'mb-2 mt-6 text-lg font-semibold',
            children: 'Contact Information',
          },
        },
        separator2: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'mb-4',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        phone: {
          type: 'string',
          title: 'Phone',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
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

export const DeclarativeSeparator: Story = {
  render: () => {
    const form = createForm({
      values: {
        firstName: 'John',
        lastName: 'Doe',
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Profile</h3>

          <SchemaField>
            <SchemaField.Void
              x-component="div"
              x-component-props={{
                className: 'mb-2 text-sm font-medium text-muted-foreground',
                children: 'Basic Information',
              }}
            />
            <SchemaField.Void
              x-component="Separator"
              x-component-props={{
                className: 'mb-4',
              }}
            />
            <SchemaField.String
              name="firstName"
              title="First Name"
              required
              x-decorator="FormItem"
              x-component="Input"
              x-component-props={{ placeholder: 'Enter first name' }}
            />
            <SchemaField.String
              name="lastName"
              title="Last Name"
              required
              x-decorator="FormItem"
              x-component="Input"
              x-component-props={{ placeholder: 'Enter last name' }}
            />

            <SchemaField.Void
              x-component="div"
              x-component-props={{
                className: 'mb-2 mt-6 text-sm font-medium text-muted-foreground',
                children: 'Account Settings',
              }}
            />
            <SchemaField.Void
              x-component="Separator"
              x-component-props={{
                className: 'mb-4',
              }}
            />
            <SchemaField.String
              name="email"
              title="Email"
              required
              x-decorator="FormItem"
              x-component="Input"
              x-component-props={{
                placeholder: 'Enter email',
                type: 'email',
              }}
            />
            <SchemaField.String
              name="username"
              title="Username"
              x-decorator="FormItem"
              x-component="Input"
              x-component-props={{ placeholder: 'Enter username' }}
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
