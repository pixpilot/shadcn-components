import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form } from '../src';
import { JsonSchemaFieldBasics } from '../src/components/schema-field/schema-field-basics';

const meta: Meta<typeof Form> = {
  title: 'Formily/Schema Field Basics',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicForm: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-component-props': {
            placeholder: 'Enter your name',
          },
          required: true,
        },
        email: {
          type: 'string',
          title: 'Email',
          'x-component-props': {
            type: 'email',
            placeholder: 'Enter your email',
          },
          required: true,
        },
        age: {
          type: 'number',
          title: 'Age',
          minimum: 0,
          maximum: 120,
        },
        newsletter: {
          type: 'boolean',
          title: 'Subscribe to newsletter',
        },
        gender: {
          type: 'string',
          title: 'Gender',
          enum: ['male', 'female', 'other'],
          'x-component-props': {
            placeholder: 'Select gender',
          },
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaFieldBasics schema={schema} />
      </Form>
    );
  },
};

export const FormWithArrays: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        hobbies: {
          type: 'array',
          title: 'Hobbies',
          items: {
            type: 'string',
          },
          'x-component': 'ArrayCards',
        },
        skills: {
          type: 'array',
          title: 'Skills',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Skill Name',
              },
              level: {
                type: 'string',
                title: 'Proficiency Level',
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
              },
            },
          },
          'x-component': 'ArrayCards',
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaFieldBasics schema={schema} />
      </Form>
    );
  },
};

export const FormWithCustomComponents: Story = {
  render: () => {
    const form = createForm();

    // Custom component for demonstration
    const CustomTextarea = ({
      value,
      onChange,
      ...props
    }: {
      value?: string;
      onChange?: (value: string) => void;
      [key: string]: unknown;
    }) => (
      <textarea
        {...props}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ width: '100%', minHeight: '80px', padding: '8px' }}
        placeholder="Custom textarea component"
      />
    );

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        description: {
          type: 'string',
          title: 'Description',
          'x-component': 'CustomTextarea',
        },
        agree: {
          type: 'boolean',
          title: 'I agree to terms',
        },
      },
    };

    const customComponents = {
      fields: {
        CustomTextarea: { component: CustomTextarea, decorator: 'FormItem' },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </Form>
    );
  },
};

export const FormWithValidation: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          required: true,
          minLength: 3,
          'x-component-props': {
            placeholder: 'At least 3 characters',
          },
        },
        password: {
          type: 'string',
          title: 'Password',
          required: true,
          minLength: 8,
          'x-component-props': {
            type: 'password',
          },
        },
        confirmPassword: {
          type: 'string',
          title: 'Confirm Password',
          required: true,
          'x-component-props': {
            type: 'password',
          },
          'x-validator': [
            {
              required: true,
              message: 'Please confirm your password',
            },
            {
              validator: '{{$self.query("password").value() === $self.value}}',
              message: 'Passwords do not match',
            },
          ],
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaFieldBasics schema={schema} />
      </Form>
    );
  },
};
