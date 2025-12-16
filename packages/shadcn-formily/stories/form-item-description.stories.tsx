/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const INDENT_SIZE = 2;

const meta: Meta<typeof Form> = {
  title: 'Formily/FormItem/Description',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const DescriptionPlacementTop: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          description: 'Choose a unique username for your account',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'top',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          description: 'We will use this email to send you updates',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'top',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
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
          alert(JSON.stringify(values, null, INDENT_SIZE));
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

export const DescriptionPlacementBottom: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          description: 'Username must be at least 3 characters long',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'bottom',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        password: {
          type: 'string',
          title: 'Password',
          description:
            'Password should contain uppercase, lowercase, numbers and symbols',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'bottom',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your password',
            type: 'password',
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
          alert(JSON.stringify(values, null, INDENT_SIZE));
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

export const DescriptionPlacementPopover: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          description:
            'Choose a unique username. It will be used as your profile identifier across the platform. Must be at least 3 characters long and can contain letters, numbers, and underscores.',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'popover',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          title: 'Email Address',
          description:
            'We use your email to send important notifications and account recovery links. Your email will not be shared with third parties.',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'popover',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        website: {
          type: 'string',
          title: 'Website',
          description:
            'Optional: Add your personal or business website URL. This will be displayed on your public profile.',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'popover',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'https://example.com',
            type: 'url',
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
          alert(JSON.stringify(values, null, INDENT_SIZE));
        }}
      >
        <SchemaField schema={schema} />
        <p className="mt-4 text-sm text-muted-foreground">
          Hover over the question mark icon to see field descriptions
        </p>
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

export const MixedDescriptionPlacements: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          description: 'Your legal first name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'top',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your first name',
          },
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          description: 'Your legal last name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'bottom',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your last name',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          description:
            'We will send a verification link to this email address. Check your spam folder if you do not receive it within a few minutes.',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'popover',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        phone: {
          type: 'string',
          title: 'Phone Number',
          description: 'Format: +1 (555) 123-4567',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'bottom',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your phone number',
            type: 'tel',
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
          alert(JSON.stringify(values, null, INDENT_SIZE));
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

export const GlobalDescriptionPlacement: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          description: 'Choose a unique username for your account',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your username',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          description: 'Your primary email address',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        bio: {
          type: 'string',
          title: 'Bio',
          description: 'Tell us about yourself',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Enter your bio',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        descriptionPlacement="popover"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, INDENT_SIZE));
        }}
      >
        <p className="mb-4 text-sm font-medium">
          Form-level description placement: <span className="text-primary">popover</span>
        </p>
        <SchemaField schema={schema} />
        <p className="mt-4 text-sm text-muted-foreground">
          All descriptions appear in popovers by default (unless overridden at field
          level)
        </p>
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

export const DescriptionWithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          title: 'Email',
          description: 'Must be a valid email address',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'bottom',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your email',
            type: 'email',
          },
          'x-validator': [
            {
              required: true,
              message: 'Email is required',
            },
            {
              pattern: /^[^@]+@[^.]+\.[^@]+$/u,
              message: 'Please enter a valid email address',
            },
          ],
        },
        password: {
          type: 'string',
          title: 'Password',
          description: 'At least 8 characters, with uppercase, lowercase, and numbers',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            descriptionPlacement: 'popover',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'Enter your password',
            type: 'password',
          },
          'x-validator': [
            {
              required: true,
              message: 'Password is required',
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/u,
              message: 'Password must contain uppercase, lowercase, and numbers',
            },
          ],
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, INDENT_SIZE));
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
