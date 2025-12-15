/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Collapse',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
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
              x-component="ArrayCollapse"
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
 * Array items with Collapse for inline editing
 * Items are displayed in a collapsible collapse format
 * Click on an item to expand and edit its fields inline
 */
export const WithJSXSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0100',
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-0101',
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact List (Collapse)</h2>
          <p className="text-muted-foreground">
            Click on a contact to expand and edit inline. The collapse keeps your list
            organized and compact.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array name="contacts" maxItems={10} x-component="ArrayCollapse">
            <SchemaField.Object x-component="ArrayCollapse.Item">
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
              <SchemaField.String
                name="phone"
                title="Phone"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter phone' }}
              />
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayCollapse.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
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

export const AccordionMode: Story = {
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
          <h2 className="text-2xl font-bold">Contact List (Collapse)</h2>
          <p className="text-muted-foreground">
            Click on a contact to expand and edit inline. The collapse keeps your list
            organized and compact.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            maxItems={10}
            x-component="ArrayCollapse"
            x-component-props={{
              mode: 'accordion',
              operations: ['MoveUp', 'MoveDown', 'Remove'],
            }}
          >
            <SchemaField.Object x-component="ArrayCollapse.Item">
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
            <SchemaField.Void x-component="ArrayCollapse.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
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

/**
 * Simple JSON Schema Form with ArrayCollapse
 * Demonstrates using JSON schema to define array items with collapse
 */
export const WithJsonSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0100',
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        contacts: {
          type: 'array',
          title: 'Contacts',
          maxItems: 10,
          'x-component': 'ArrayCollapse',
          items: {
            type: 'object',
            'x-component': 'ArrayCollapse.Item',
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': { placeholder: 'Enter name' },
                required: true,
              },
              email: {
                type: 'string',
                title: 'Email',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': { type: 'email', placeholder: 'Enter email' },
                required: true,
              },
              phone: {
                type: 'string',
                title: 'Phone',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': { placeholder: 'Enter phone' },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Contact',
              'x-component': 'ArrayCollapse.Addition',
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="space-y-6"
        settings={{
          label: {
            useFieldNameAsLabel: true,
          },
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">JSON Schema ArrayCollapse Form</h2>
          <p className="text-muted-foreground">
            This form uses JSON schema to define an array with ArrayCollapse component,
            demonstrating declarative form definition for collapsible array items.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="border-t pt-4">
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
