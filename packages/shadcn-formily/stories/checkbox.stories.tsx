/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Checkbox',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicCheckbox: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        agreeToTerms: {
          type: 'boolean',
          title: 'I agree to the terms and conditions',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
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

export const MultipleCheckboxes: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        newsletter: {
          type: 'boolean',
          title: 'Subscribe to newsletter',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        marketingEmails: {
          type: 'boolean',
          title: 'Receive marketing emails',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        smsUpdates: {
          type: 'boolean',
          title: 'Receive SMS updates',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
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

export const CheckboxInNestedObject: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        userPreferences: {
          type: 'object',
          title: 'User Preferences',
          properties: {
            enableNotifications: {
              type: 'boolean',
              title: 'Enable notifications',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            darkMode: {
              type: 'boolean',
              title: 'Dark mode',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            autoSave: {
              type: 'boolean',
              title: 'Auto save',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
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

export const RequiredCheckbox: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        acceptTerms: {
          type: 'boolean',
          title: 'I accept the terms and conditions',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        agreeToPrivacy: {
          type: 'boolean',
          title: 'I agree to the privacy policy',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
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
