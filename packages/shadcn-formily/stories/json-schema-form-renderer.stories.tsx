import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Form } from '../src';
import { JsonSchemaFormRenderer } from '../src/components/json-schema-form-renderer';

const meta: Meta<typeof Form> = {
  title: 'Formily/JSON Schema Form Renderer',
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

export const BasicJsonSchemaForm: Story = {
  render: () => {
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
      },
    };

    return <JsonSchemaFormRenderer schema={schema}></JsonSchemaFormRenderer>;
  },
};

export const AdvancedJsonSchemaForm: Story = {
  render: () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        age: {
          type: 'integer',
          title: 'Age (Integer)',
          minimum: 0,
          maximum: 120,
        },
        height: {
          type: 'number',
          title: 'Height (Number)',
        },
        isActive: {
          type: 'boolean',
          title: 'Is Active',
        },
        hobbies: {
          type: 'array',
          title: 'Hobbies',
          items: {
            type: 'string',
          },
        },
        tags: {
          type: 'array',
          title: 'Tags',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Tag Name',
              },
              value: {
                type: 'string',
                title: 'Tag Value',
              },
            },
          },
        },
      },
    };

    return <JsonSchemaFormRenderer schema={schema}></JsonSchemaFormRenderer>;
  },
};
