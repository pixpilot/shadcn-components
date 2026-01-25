/* eslint-disable no-alert */

import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Cards',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayCards',
  displayTitle: 'ArrayCards',
  componentProps: {
    className: 'space-y-4',
  },
};

const {
  Declarative,
  EmptyArray,
  Sortable,
  SortableDisabledInForm,
  SortableNested,
  SortableDisabledForArray,
  WithActions,
  WithComponentClassName,
  WithItemReactionTitle,
  WithJSONSchema,
  WithTruncatedLabels,
} = createStories(storyConfig);

export {
  Declarative,
  EmptyArray,
  Sortable,
  SortableDisabledForArray,
  SortableDisabledInForm,
  SortableNested,
  WithActions,
  WithComponentClassName,
  WithItemReactionTitle,
  WithJSONSchema,
  WithTruncatedLabels,
};

export const WithCustomComponent: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: Array.from({ length: 2 }).map((_, i) => ({
          name: `Contact ${i + 1}`,
        })),
      },
    });

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
              x-component="ArrayCards"
              x-component-props={{
                className: 'space-y-4',
                title: ' Custom Contacts',
                // Disable default built-in header actions, and render operations from schema.
                actions: false,
              }}
            >
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayCards.MoveDown"
                  x-component-props={{
                    icon: <span>Down</span>,
                  }}
                />
                <SchemaField.Void
                  x-component="ArrayCards.MoveUp"
                  x-component-props={{
                    icon: <span>UP</span>,
                  }}
                />
                <SchemaField.Void
                  x-component="ArrayCards.Copy"
                  x-component-props={{
                    icon: <span>CPY</span>,
                  }}
                />
                <SchemaField.Void
                  x-component="ArrayCards.Remove"
                  x-component-props={{
                    icon: <span>Del</span>,
                  }}
                />
                <SchemaField.Void x-component="ArrayCards.Index" />

                <SchemaField.String
                  name="name"
                  title="Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter name' }}
                />
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayCards.Addition" title="Add New Name" />
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

export const WithOverrideComponent: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: Array.from({ length: 2 }).map((_, i) => ({
          name: `Contact ${i + 1}`,
        })),
      },
    });

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
              x-component="ArrayCards"
              x-component-props={{
                className: 'space-y-4',
                title: ' Custom Contacts',
                transformActions: (actions) =>
                  actions.map((a) =>
                    a === 'remove' ? { type: 'remove', icon: <span>Del</span> } : a,
                  ),
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
              <SchemaField.Void x-component="ArrayCards.Addition" title="Add New Name" />
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
 * Array field using JSON Schema with custom actions (similar to WithCustomComponent)
 */
export const WithCustomComponentJsonSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: Array.from({ length: 2 }).map((_, i) => ({
          name: `Contact ${i + 1}`,
        })),
      },
    });

    const schema = {
      type: 'object',
      properties: {
        contacts: {
          type: 'array',
          'x-component': 'ArrayCards',
          'x-component-props': {
            className: 'space-y-4',
            title: ' Custom Contacts',
            // Disable default built-in header actions, and render operations from schema.
            actions: false,
          },
          items: {
            type: 'object',
            properties: {
              moveDown: {
                type: 'void',
                'x-component': 'ArrayCards.MoveDown',
                'x-component-props': {
                  icon: 'Down',
                },
              },
              moveUp: {
                type: 'void',
                'x-component': 'ArrayCards.MoveUp',
                'x-component-props': {
                  icon: 'UP',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayCards.Remove',
                'x-component-props': {
                  icon: 'Del',
                },
              },
              copy: {
                type: 'void',
                'x-component': 'ArrayCards.Copy',
                'x-component-props': {
                  icon: 'CPY',
                },
              },
              index: {
                type: 'void',
                'x-component': 'ArrayCards.Index',
              },
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
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add New Name',
              'x-component': 'ArrayCards.Addition',
            },
          },
        },
      },
    };

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
          <h3 className="text-lg font-medium">Contacts (Custom JSON Schema)</h3>

          <SchemaField schema={schema} />
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
 * Array field with nested arrays using JSON Schema
 */
export const NestedArraysJsonSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        companies: [
          {
            name: 'Acme Corp',
            employees: [
              { name: 'John Doe', email: 'john@acme.com' },
              { name: 'Jane Smith', email: 'jane@acme.com' },
            ],
          },
          {
            name: 'Tech Inc',
            employees: [{ name: 'Bob Johnson', email: 'bob@tech.com' }],
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        companies: {
          type: 'array',
          'x-component': 'ArrayCards',
          'x-component-props': {
            className: 'space-y-4',
          },
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Company Name',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Enter company name',
                },
              },
              employees: {
                type: 'array',
                title: 'Employees',
                'x-component': 'ArrayCards',
                'x-component-props': {
                  className: 'space-y-2 ml-4',
                },
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      title: 'Employee Name',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: 'Enter employee name',
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
                    title: 'Add Employee',
                    'x-component': 'ArrayCards.Addition',
                    'x-component-props': {
                      defaultValue: { name: '', email: '' },
                    },
                  },
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Company',
              'x-component': 'ArrayCards.Addition',
              'x-component-props': {
                defaultValue: { name: '', employees: [] },
              },
            },
          },
        },
      },
    };

    const JSON_INDENT = 2;

    return (
      <Form
        form={form}
        className="w-[600px]"
        settings={{
          label: {
            useFieldNameAsLabel: true,
          },
        }}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);

          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Companies & Employees (Nested Arrays)</h3>

          <SchemaField schema={schema} />
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
 * Array field with nested arrays using SchemaField components
 */
export const NestedArraysDeclarative: Story = {
  render: () => {
    const form = createForm({
      values: {
        companies: [
          {
            name: 'Acme Corp',
            employees: [
              { name: 'John Doe', email: 'john@acme.com' },
              // { name: 'Jane Smith', email: 'jane@acme.com' },
            ],
          },
        ],
      },
    });

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
          <h3 className="text-lg font-medium">Companies & Employees (SchemaField)</h3>

          <SchemaField>
            <SchemaField.Array
              name="companies"
              x-component="ArrayCards"
              x-component-props={{
                className: 'space-y-4',
              }}
            >
              <SchemaField.Object>
                <SchemaField.String
                  name="name"
                  title="Company Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter company name' }}
                />
                <SchemaField.Array
                  name="employees"
                  title="Employees"
                  x-component="ArrayCards"
                  x-component-props={{
                    className: 'space-y-2 ml-4',
                  }}
                >
                  <SchemaField.Object>
                    <SchemaField.String
                      name="name"
                      title="Employee Name"
                      required
                      x-decorator="FormItem"
                      x-component="Input"
                      x-component-props={{ placeholder: 'Enter employee name' }}
                    />
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayCards.Addition"
                    title="Add Employee"
                    x-component-props={{ defaultValue: { name: '', email: '' } }}
                  />
                </SchemaField.Array>
              </SchemaField.Object>
              <SchemaField.Void
                x-component="ArrayCards.Addition"
                title="Add Company"
                x-component-props={{ defaultValue: { name: '', employees: [] } }}
              />
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
