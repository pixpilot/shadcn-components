/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Switch',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicSwitch: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        notifications: {
          type: 'boolean',
          title: 'Enable Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
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

export const MultipleSwitches: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        emailNotifications: {
          type: 'boolean',
          title: 'Email Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        pushNotifications: {
          type: 'boolean',
          title: 'Push Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        smsNotifications: {
          type: 'boolean',
          title: 'SMS Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
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

export const SwitchWithSettings: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        darkMode: {
          type: 'boolean',
          title: 'Dark Mode',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        autoSave: {
          type: 'boolean',
          title: 'Auto Save',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        showPreview: {
          type: 'boolean',
          title: 'Show Preview',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        enableAnalytics: {
          type: 'boolean',
          title: 'Enable Analytics',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
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

export const DeclarativeSwitch: Story = {
  render: () => {
    const form = createForm({
      values: {
        emailNotifications: true,
        darkMode: false,
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
          <h3 className="text-lg font-semibold">Preferences</h3>

          <SchemaField>
            <SchemaField.Boolean
              name="emailNotifications"
              title="Email Notifications"
              x-decorator="FormItem"
              x-component="Switch"
            />
            <SchemaField.Boolean
              name="pushNotifications"
              title="Push Notifications"
              x-decorator="FormItem"
              x-component="Switch"
            />
            <SchemaField.Void
              x-component="Separator"
              x-component-props={{
                className: 'my-4',
              }}
            />
            <SchemaField.Boolean
              name="darkMode"
              title="Dark Mode"
              x-decorator="FormItem"
              x-component="Switch"
            />
            <SchemaField.Boolean
              name="compactMode"
              title="Compact Mode"
              x-decorator="FormItem"
              x-component="Switch"
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
