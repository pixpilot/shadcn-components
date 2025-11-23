/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
/* eslint-disable ts/no-misused-promises */

import type { Meta, StoryObj } from '@storybook/react';
import { ArrayField } from '@formily/react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/shadcn';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import React from 'react';
import { createForm, Field, Form, FormItem, Input, SchemaField, Textarea } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Items - Advanced Examples',
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

/*
 * This file demonstrates THREE different approaches to working with array fields:
 *
 * 1. MANUAL APPROACH (BasicList, ComplexFields):
 *    - Uses ArrayField with render props: {(field) => { ... }}
 *    - Manually implements Dialog with Field components
 *    - More control but more boilerplate
 *
 * 2. SCHEMA OBJECT APPROACH (JSONSchemaArrayItems):
 *    - Uses SchemaField with a schema object
 *    - Declarative but requires creating schema objects
 *
 * 3. DECLARATIVE JSX APPROACH (DeclarativeArrayItems):
 *    - Uses SchemaField.Array, SchemaField.Object, etc.
 *    - Most elegant - no render props, no manual schema objects
 *    - This is the recommended Formily way!
 */

/**
 * Basic list of items with move up/down, edit, and remove functionality
 * MANUAL APPROACH: Uses ArrayField render props with Dialog
 */
export const BasicList: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        tasks: [
          { title: 'Task 1', description: 'Description for task 1' },
          { title: 'Task 2', description: 'Description for task 2' },
          { title: 'Task 3', description: 'Description for task 3' },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Task List</h2>
          <p className="text-muted-foreground">
            Manage your tasks with move up/down, edit, and remove controls
          </p>
        </div>

        <ArrayField name="tasks">
          {(field) => {
            const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

            return (
              <div className="space-y-2">
                {field.value?.map((_: unknown, index: number) => (
                  <div key={index} className="relative">
                    <div className="border-input bg-card hover:bg-accent/50 flex items-center gap-2 rounded-md border p-3 transition-colors">
                      {/* Left: Move up/down buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={index === 0}
                          onClick={async () => {
                            await field.moveUp(index);
                          }}
                        >
                          <ChevronUpIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={index === (field.value?.length ?? 0) - 1}
                          onClick={async () => {
                            await field.moveDown(index);
                          }}
                        >
                          <ChevronDownIcon className="size-4" />
                        </Button>
                      </div>

                      {/* Center: Item label */}
                      <div className="text-foreground flex-1 font-medium">
                        <span className="font-medium">#{index + 1}</span> Item
                      </div>

                      {/* Right: Edit and Remove buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => setEditingIndex(index)}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={async () => {
                            await field.remove(index);
                          }}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await field.push({ title: '', description: '' });
                  }}
                >
                  <PlusIcon className="mr-2 size-4" />
                  Add Task
                </Button>

                {/* Edit Dialog - Manual Field approach */}
                {editingIndex !== null && (
                  <Dialog
                    open={editingIndex !== null}
                    onOpenChange={(open) => {
                      if (!open) setEditingIndex(null);
                    }}
                  >
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Edit Item #{editingIndex + 1}</DialogTitle>
                        <DialogDescription>
                          Make changes to the item. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Field
                          name={`tasks.${editingIndex}.title`}
                          title="Title"
                          required
                          decorator={[FormItem]}
                          component={[Input, { placeholder: 'Task title' }]}
                        />
                        <Field
                          name={`tasks.${editingIndex}.description`}
                          title="Description"
                          decorator={[FormItem]}
                          component={[Textarea, { placeholder: 'Task description' }]}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingIndex(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={() => setEditingIndex(null)}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          }}
        </ArrayField>

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => {
              alert(JSON.stringify(form.values, null, 2));
            }}
          >
            View Values
          </Button>
        </div>
      </Form>
    );
  },
};

/**
 * Array items using JSON Schema with ArrayItems component (Object notation)
 */
export const JSONSchemaArrayItems: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
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
          'x-component': 'ArrayItems',
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
              'x-component': 'ArrayItems.Addition',
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

/**
 * Array items using SchemaField JSX notation (Declarative approach like Formily)
 * This is the cleanest approach without render props
 */
export const DeclarativeArrayItems: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        products: [
          {
            name: 'Product 1',
            category: 'electronics',
            price: 99.99,
            quantity: 10,
          },
          {
            name: 'Product 2',
            category: 'books',
            price: 19.99,
            quantity: 50,
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Product Inventory (Declarative)</h2>
          <p className="text-muted-foreground">
            Using SchemaField.Array - No render props, clean declarative syntax
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array name="products" maxItems={10} x-component="ArrayItems">
            <SchemaField.Object x-component="ArrayItems.Item">
              <SchemaField.String
                name="name"
                title="Product Name"
                required
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter product name' }}
              />
              <SchemaField.String
                name="category"
                title="Category"
                required
                x-decorator="FormItem"
                x-component="Select"
                x-component-props={{
                  placeholder: 'Select category',
                  options: [
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'books', label: 'Books' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'food', label: 'Food' },
                  ],
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <SchemaField.Number
                  name="price"
                  title="Price ($)"
                  required
                  x-decorator="FormItem"
                  x-component="NumberInput"
                  x-component-props={{ placeholder: '0.00', step: 0.01 }}
                />
                <SchemaField.Number
                  name="quantity"
                  title="Quantity"
                  required
                  x-decorator="FormItem"
                  x-component="NumberInput"
                  x-component-props={{ placeholder: '0' }}
                />
              </div>
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayItems.Addition" title="Add Product" />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Inventory
          </Button>
        </div>
      </Form>
    );
  },
};
