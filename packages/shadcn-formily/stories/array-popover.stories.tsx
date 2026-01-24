/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';

import { Anchor, InfoIcon, PinIcon } from 'lucide-react';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Popover',
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
              x-component="ArrayPopover"
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

    return (
      <Form
        form={form}
        className="space-y-6 w-[700px]"
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
          <h2 className="text-2xl font-bold">ArrayPopover (Header actions)</h2>
          <p className="text-muted-foreground">
            The list items use the shared header row, so custom actions render here too.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array name="contacts" x-component="ArrayPopover">
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
          </SchemaField.Array>
        </SchemaField>

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

    return (
      <Form
        form={form}
        className="space-y-6 w-[700px]"
        settings={{
          array: {
            item: {
              actions: [
                'up',
                {
                  key: 'info',
                  tooltip: 'Global info action',
                  icon: <InfoIcon className="size-4" />,
                  onClick: ({ index }) => {
                    alert(`Global info clicked for index ${index}`);
                  },
                },
                {
                  key: 'anchor',
                  tooltip: 'Global anchor action',
                  icon: <Anchor className="size-4" />,
                  onClick: ({ index }) => {
                    alert(`Global anchor clicked for index ${index}`);
                  },
                },
              ],
            },
          },
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">ArrayPopover (Mixed header actions)</h2>
          <p className="text-muted-foreground">
            Global Form actions + per-array actions are merged (per-array overrides by
            key).
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            x-component="ArrayPopover"
            x-component-props={{
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
          </SchemaField.Array>
        </SchemaField>

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

/**
 * Verifies that ArrayPopover forwards `x-component-props.className` to a DOM container,
 * and that item-level schema `x-component-props.className` is applied inside the popover
 * editor even though it uses `onlyRenderProperties`.
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
          'x-component': 'ArrayPopover',
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
              'x-component': 'ArrayPopover.Addition',
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
          <h2 className="text-2xl font-bold">Contact List (ArrayPopover)</h2>
        </div>
        <div className="w-100">
          <SchemaField>
            <SchemaField.Array name="contacts" maxItems={10} x-component="ArrayPopover">
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

/**
 * Array items using JSON Schema with ArrayItems component (Object notation)
 */
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
          'x-component': 'ArrayPopover',
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
              'x-component': 'ArrayPopover.Addition',
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
          'x-component': 'ArrayPopover',
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
              'x-component': 'ArrayPopover.Addition',
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

export const WithTruncatedLabels: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [
          { name: 'This is a very long item name that should be truncated properly' },
          { name: 'Another extremely lengthy item name to test truncation' },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayPopover',
          items: {
            type: 'object',
            'x-reactions': {
              fulfill: {
                state: {
                  title: "{{$self.value?.name || 'Item'}}",
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
                  className: 'w-64',
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayPopover.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6 w-80">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">ArrayPopover (Truncated Labels)</h2>
          <p className="text-muted-foreground">
            Open the editor to verify that long labels are truncated with ellipsis.
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
