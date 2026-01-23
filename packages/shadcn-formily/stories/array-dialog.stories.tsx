/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';

import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Dialog',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <div className="w-[700px]">
  //       <Story />
  //     </div>
  //   ),
  // ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const EmptyArray: Story = {
  render: () => {
    const form = createForm({});

    const JSON_INDENT = 2;

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);

          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contacts</h3>

          <SchemaField>
            <SchemaField.Array
              name="contacts"
              x-component="ArrayDialog"
              x-component-props={{
                className: 'space-y-4',
              }}
            >
              <SchemaField.Object>
                <SchemaField.String
                  name="name"
                  title="Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter name' }}
                />
              </SchemaField.Object>
            </SchemaField.Array>
          </SchemaField>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </Form>
    );
  },
};

/**
 * Verifies that ArrayDialog forwards `x-component-props.className` to the list container
 * and that item-level schema `x-component-props.className` is applied inside the editor
 * even though it uses `onlyRenderProperties`.
 */
export const WithComponentClassName: Story = {
  render: () => {
    const form = createForm({
      values: {
        users: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          'x-component': 'ArrayDialog',
          'x-component-props': {
            className: 'space-y-4 bg-slate-200 p-3 rounded-md',
          },
          items: {
            type: 'object',
            'x-component-props': {
              className: 'bg-slate-50 p-3 rounded-md',
            },
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter name',
                },
              },
              email: {
                type: 'string',
                title: 'Email',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter email',
                  type: 'email',
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add User',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">ArrayDialog (ClassName propagation)</h2>
          <p className="text-muted-foreground">
            Open an item to verify the editor wrapper styling.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
};

export const Declarative: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          {
            name: 'Bob Builder',
            email: 'bob@example.com',
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact List (ArrayDialog)</h2>
        </div>
        <div className="w-100">
          <SchemaField>
            <SchemaField.Array name="contacts" maxItems={10} x-component="ArrayDialog">
              <SchemaField.Object>
                <SchemaField.String
                  name="name"
                  title="Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter name' }}
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
              </SchemaField.Object>
            </SchemaField.Array>
          </SchemaField>
        </div>
        <div className=" pt-4">
          <Button
            onClick={() => {
              form
                .submit()
                .then(() => {
                  alert(JSON.stringify(form.values, null, 2));
                })
                .catch(console.error);
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    );
  },
};

export const WithJSONSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        users: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            address: { street: '123 Main St', city: 'Anytown' },
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            address: { street: '456 Oak Ave', city: 'Somewhere' },
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          'x-component': 'ArrayDialog',
          title: 'Contacts',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter name',
                },
              },
              email: {
                type: 'string',
                title: 'Email',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter email',
                  type: 'email',
                },
              },
              role: {
                type: 'string',
                title: 'Role',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: 'Select role',
                  options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'user', label: 'User' },
                    { value: 'moderator', label: 'Moderator' },
                  ],
                },
              },
              address: {
                type: 'object',
                title: 'Address',
                properties: {
                  street: {
                    type: 'string',
                    title: 'Street',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: 'Enter street',
                    },
                  },
                  city: {
                    type: 'string',
                    title: 'City',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: 'Enter city',
                    },
                  },
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add User',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">User Management (Schema Object)</h2>
          <p className="text-muted-foreground">
            Array items defined using JSON Schema object with ArrayItems component
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Users Data
          </Button>
        </div>
      </Form>
    );
  },
};

export const WithItemReactionTitle: Story = {
  render: () => {
    const form = createForm({
      values: {
        users: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          'x-component': 'ArrayDialog',
          items: {
            type: 'object',
            'x-reactions': {
              fulfill: {
                state: {
                  title: "{{$self.value?.name || 'User'}}",
                },
              },
            },
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter name',
                },
              },
              email: {
                type: 'string',
                title: 'Email',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter email',
                  type: 'email',
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add User',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">ArrayPopover (ClassName propagation)</h2>
          <p className="text-muted-foreground">
            Open the editor to verify the wrapper styling.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
};

export const LongDialog: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [
          {
            name: 'Sample Item 1',
            description: 'This is a sample description for the first item.',
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayDialog',
          'x-component-props': {
            className: 'max-h-[80vh] overflow-y-auto',
          },
          items: {
            type: 'object',
            properties: {
              ...Array.from({ length: 30 }, (_, i) => ({
                [`field${i + 1}`]: {
                  type: 'string',
                  title: `Field ${i + 1}`,
                  required: i < 2, // Make first two fields required
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: `Enter value for field ${i + 1}`,
                  },
                },
              })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              description: {
                type: 'string',
                title: 'Description',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Enter a detailed description',
                  rows: 4,
                },
              },
              notes: {
                type: 'string',
                title: 'Additional Notes',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Any additional notes or comments',
                  rows: 3,
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Long Dialog Array</h2>
          <p className="text-muted-foreground">
            This array dialog contains many fields to demonstrate scrolling behavior in
            long forms.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Data
          </Button>
        </div>
      </Form>
    );
  },
};
