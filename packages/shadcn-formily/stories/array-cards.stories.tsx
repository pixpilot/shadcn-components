import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn-ui';
import { Anchor, InfoIcon, PinIcon } from 'lucide-react';
import { createForm, Form, SchemaField } from '../src';

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
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contacts</h3>

          <SchemaField>
            <SchemaField.Array
              name="contacts"
              title="Contacts"
              x-component="ArrayCards"
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

export const WithHeaderActions: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          { name: 'Bob Builder', email: 'bob@example.com', pinned: true },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });

    const JSON_INDENT = 2;

    return (
      <Form
        form={form}
        className="w-[700px] space-y-6"
        settings={{
          array: {
            item: {
              actions: [
                {
                  type: 'toggle',
                  key: 'pin',
                  inactiveTooltip: 'Pin item',
                  activeTooltip: 'Unpin item',
                  icon: <PinIcon className="size-4" />,
                  activeIcon: <PinIcon className="size-4" fill="currentColor" />,
                  isActive: ({ record }) => {
                    return Boolean((record as { pinned?: boolean } | null)?.pinned);
                  },
                  onToggle: ({ array, index }, nextActive) => {
                    const currentValue = array.field.value;
                    const currentArray = Array.isArray(currentValue)
                      ? (currentValue as unknown[])
                      : [];
                    const nextValue = [...currentArray];

                    const currentItem = (nextValue[index] ?? {}) as Record<
                      string,
                      unknown
                    >;

                    nextValue[index] = {
                      ...currentItem,
                      pinned: nextActive,
                    };

                    array.field.setValue(nextValue as any[]);
                  },
                },
                {
                  key: 'info',
                  tooltip: 'Show info',
                  icon: <InfoIcon className="size-4" />,
                  onClick: ({ index, itemField }) => {
                    const address = (
                      itemField as { address?: { toString?: () => string } } | null
                    )?.address;

                    // eslint-disable-next-line no-alert
                    alert(
                      `Info clicked for index ${index}\nField: ${String(
                        address?.toString?.() ?? '',
                      )}`,
                    );
                  },
                },
              ],
            },
          },
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">ArrayCards (Header actions)</h2>
          <p className="text-muted-foreground">
            Custom actions are shared and render in the card header next to default
            operations.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            x-component="ArrayCards"
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
              <SchemaField.String
                name="email"
                title="Email"
                required
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter email' }}
              />
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayCards.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // eslint-disable-next-line no-alert
              alert(JSON.stringify(form.values, null, JSON_INDENT));
            }}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
};

export const WithMixedHeaderActions: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          { name: 'Bob Builder', email: 'bob@example.com', pinned: true },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });

    const JSON_INDENT = 2;

    return (
      <Form
        form={form}
        className="w-[700px] space-y-6"
        settings={{
          array: {
            item: {
              actions: [
                'edit',
                {
                  key: 'info',
                  tooltip: 'Global info action',
                  icon: <InfoIcon className="size-4" />,
                  onClick: ({ index }) => {
                    // eslint-disable-next-line no-alert
                    alert(`Global info clicked for index ${index}`);
                  },
                },
                {
                  key: 'anchor',
                  tooltip: 'Global anchor action',
                  icon: <Anchor className="size-4" />,
                  onClick: ({ index }) => {
                    // eslint-disable-next-line no-alert
                    alert(`Global anchor clicked for index ${index}`);
                  },
                },
              ],
            },
          },
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">ArrayCards (Mixed header actions)</h2>
          <p className="text-muted-foreground">
            Global Form actions + per-array actions are merged (appended).
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            x-component="ArrayCards"
            x-component-props={{
              className: 'space-y-4',
              actions: [
                {
                  type: 'toggle',
                  key: 'pin',
                  inactiveTooltip: 'Pin item (array-level)',
                  activeTooltip: 'Unpin item (array-level)',
                  icon: <PinIcon className="size-4" />,
                  activeIcon: <PinIcon className="size-4" fill="currentColor" />,
                  isActive: ({ record }) => {
                    return Boolean((record as { pinned?: boolean } | null)?.pinned);
                  },
                  onToggle: ({ array, index }, nextActive) => {
                    const currentValue = array.field.value;
                    const currentArray = Array.isArray(currentValue)
                      ? (currentValue as unknown[])
                      : [];
                    const nextValue = [...currentArray];

                    const currentItem = (nextValue[index] ?? {}) as Record<
                      string,
                      unknown
                    >;

                    nextValue[index] = {
                      ...currentItem,
                      pinned: nextActive,
                    };

                    array.field.setValue(nextValue as any[]);
                  },
                },
              ],
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
              <SchemaField.String
                name="email"
                title="Email"
                required
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter email' }}
              />
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayCards.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // eslint-disable-next-line no-alert
              alert(JSON.stringify(form.values, null, JSON_INDENT));
            }}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
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
          // eslint-disable-next-line no-alert
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
          // eslint-disable-next-line no-alert
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
          // eslint-disable-next-line no-alert
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

export const WithComponentClassName: Story = {
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
            className: 'bg-slate-400',
            title: ' Custom Contacts',
            actions: false,
          },
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
            },
            'x-component': 'div',
            'x-component-props': {
              className: 'bg-slate-500',
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
        className="w-[600px] "
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
          // eslint-disable-next-line no-alert
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

export const WithJSONSchema: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
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
          },
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
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Contact',
              'x-component': 'ArrayCards.Addition',
              'x-component-props': {
                defaultValue: { name: '', email: '' },
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
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contacts (JSON Schema)</h3>

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
          // eslint-disable-next-line no-alert
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
          // eslint-disable-next-line no-alert
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

    const JSON_INDENT = 2;

    const schema = {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          'x-component': 'ArrayCards',
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
              'x-component': 'ArrayCards.Addition',
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
            // eslint-disable-next-line no-alert
            onClick={() => alert(JSON.stringify(form.values, null, JSON_INDENT))}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
};
