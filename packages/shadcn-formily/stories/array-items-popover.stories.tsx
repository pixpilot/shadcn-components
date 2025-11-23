/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@internal/shadcn';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Items - Popover Examples',
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
 * Array items with Popover for inline editing
 * DECLARATIVE JSX APPROACH with Popover instead of Dialog
 * Popover validates on close and won't close if validation fails
 */
export const PopoverInlineEdit: Story = {
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
          <h2 className="text-2xl font-bold">Contact List (Popover Edit)</h2>
          <p className="text-muted-foreground">
            Click the edit icon to edit contacts inline with a popover. Popover validates
            on close and won't close if validation fails.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            maxItems={10}
            x-component="ArrayItemsPopover"
          >
            {/*
              ArrayItemsPopover.Item will automatically render with Edit button
              The Edit button will open a Popover for inline editing
            */}
            <SchemaField.Object x-component="ArrayItemsPopover.Item">
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
              x-component="ArrayItemsPopover.Addition"
              title="Add Contact"
            />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Contacts
          </Button>
        </div>
      </Form>
    );
  },
};

/**
 * Comparison: Dialog vs Popover
 * Shows both editing modes side-by-side
 */
export const DialogVsPopoverComparison: Story = {
  render: () => {
    const dialogForm = createForm({
      initialValues: {
        tasks: [
          { title: 'Task 1', description: 'Description 1' },
          { title: 'Task 2', description: 'Description 2' },
        ],
      },
    });

    const popoverForm = createForm({
      initialValues: {
        tasks: [
          { title: 'Task 1', description: 'Description 1' },
          { title: 'Task 2', description: 'Description 2' },
        ],
      },
    });

    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Dialog Example */}
        <Form form={dialogForm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Using Dialog</h3>
            <p className="text-muted-foreground text-sm">
              Opens in a centered modal overlay
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
            <p className="text-muted-foreground text-sm">Opens inline next to the item</p>
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
      </div>
    );
  },
};

/**
 * Complex form with nested objects in Popover
 */
export const PopoverComplexForm: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        users: [
          {
            name: 'John Doe',
            email: 'john@example.com',
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
          <h2 className="text-2xl font-bold">User Management (Popover)</h2>
          <p className="text-muted-foreground">
            Complex nested forms with validation in popover
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array name="users" maxItems={10} x-component="ArrayItemsPopover">
            <SchemaField.Object x-component="ArrayItemsPopover.Item">
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
            <SchemaField.Void x-component="ArrayItemsPopover.Addition" title="Add User" />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Users
          </Button>
        </div>
      </Form>
    );
  },
};
