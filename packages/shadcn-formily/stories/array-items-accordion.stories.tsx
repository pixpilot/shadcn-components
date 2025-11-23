/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@internal/shadcn';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Items - Accordion Examples',
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

/**
 * Array items with Accordion for inline editing
 * Items are displayed in a collapsible accordion format
 * Click on an item to expand and edit its fields inline
 */
export const AccordionInlineEdit: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
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
          <h2 className="text-2xl font-bold">Contact List (Accordion)</h2>
          <p className="text-muted-foreground">
            Click on a contact to expand and edit inline. The accordion keeps your list
            organized and compact.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            maxItems={10}
            x-component="ArrayItemsAccordion"
          >
            <SchemaField.Object x-component="ArrayItemsAccordion.Item">
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
            <SchemaField.Void
              x-component="ArrayItemsAccordion.Addition"
              title="Add Contact"
            />
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
 * Complex nested form with accordion
 * Shows how accordion works with more fields
 */
export const AccordionComplexForm: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        users: [
          {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'admin',
            settings: {
              notifications: true,
              theme: 'dark',
            },
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">User Management (Accordion)</h2>
          <p className="text-muted-foreground">
            Complex nested forms with validation in accordion format. Keeps large forms
            manageable.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array name="users" maxItems={10} x-component="ArrayItemsAccordion">
            <SchemaField.Object x-component="ArrayItemsAccordion.Item">
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
                name="role"
                title="Role"
                required
                x-decorator="FormItem"
                x-component="Select"
                x-component-props={{
                  placeholder: 'Select role',
                  options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'user', label: 'User' },
                    { value: 'guest', label: 'Guest' },
                  ],
                }}
              />
              <SchemaField.Object name="settings" title="Settings">
                <SchemaField.Boolean
                  name="notifications"
                  title="Enable Notifications"
                  x-decorator="FormItem"
                  x-component="Checkbox"
                />
                <SchemaField.String
                  name="theme"
                  title="Theme"
                  x-decorator="FormItem"
                  x-component="Select"
                  x-component-props={{
                    placeholder: 'Select theme',
                    options: [
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'auto', label: 'Auto' },
                    ],
                  }}
                />
              </SchemaField.Object>
            </SchemaField.Object>
            <SchemaField.Void
              x-component="ArrayItemsAccordion.Addition"
              title="Add User"
            />
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
 * Compare: Dialog, Popover, and Accordion
 * Shows all three approaches side by side
 */
export const CompareAllThree: Story = {
  render: () => {
    const dialogForm = createForm({
      initialValues: {
        tasks: [{ title: 'Task 1', description: 'Dialog edit' }],
      },
    });

    const popoverForm = createForm({
      initialValues: {
        tasks: [{ title: 'Task 1', description: 'Popover edit' }],
      },
    });

    const accordionForm = createForm({
      initialValues: {
        tasks: [{ title: 'Task 1', description: 'Accordion edit' }],
      },
    });

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Editing Approaches Comparison</h2>
          <p className="text-muted-foreground">
            Three different ways to edit array items: Dialog (modal), Popover (inline
            popup), and Accordion (expandable inline)
          </p>
        </div>

        {/* Dialog Example */}
        <Form form={dialogForm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Using Dialog</h3>
            <p className="text-muted-foreground text-sm">
              Opens in a centered modal overlay - best for complex forms
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array name="tasks" maxItems={5} x-component="ArrayItems">
              <SchemaField.Object x-component="ArrayItems.Item">
                <SchemaField.String
                  name="title"
                  title="Title"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                />
                <SchemaField.String
                  name="description"
                  title="Description"
                  x-decorator="FormItem"
                  x-component="Textarea"
                />
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayItems.Addition" title="Add Task" />
            </SchemaField.Array>
          </SchemaField>
        </Form>

        {/* Popover Example */}
        <Form form={popoverForm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Using Popover</h3>
            <p className="text-muted-foreground text-sm">
              Opens inline next to the item - best for quick edits
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array name="tasks" maxItems={5} x-component="ArrayItemsPopover">
              <SchemaField.Object x-component="ArrayItemsPopover.Item">
                <SchemaField.String
                  name="title"
                  title="Title"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                />
                <SchemaField.String
                  name="description"
                  title="Description"
                  x-decorator="FormItem"
                  x-component="Textarea"
                />
              </SchemaField.Object>
              <SchemaField.Void
                x-component="ArrayItemsPopover.Addition"
                title="Add Task"
              />
            </SchemaField.Array>
          </SchemaField>
        </Form>

        {/* Accordion Example */}
        <Form form={accordionForm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Using Accordion</h3>
            <p className="text-muted-foreground text-sm">
              Expands inline within the item - best for keeping context and managing many
              items
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array
              name="tasks"
              maxItems={5}
              x-component="ArrayItemsAccordion"
            >
              <SchemaField.Object x-component="ArrayItemsAccordion.Item">
                <SchemaField.String
                  name="title"
                  title="Title"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                />
                <SchemaField.String
                  name="description"
                  title="Description"
                  x-decorator="FormItem"
                  x-component="Textarea"
                />
              </SchemaField.Object>
              <SchemaField.Void
                x-component="ArrayItemsAccordion.Addition"
                title="Add Task"
              />
            </SchemaField.Array>
          </SchemaField>
        </Form>
      </div>
    );
  },
};
