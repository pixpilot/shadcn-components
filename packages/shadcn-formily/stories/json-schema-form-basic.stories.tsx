import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Form } from '../src';
import { JsonSchemaFormBasic } from '../src/components/json-schema-form-renderer';

const meta: Meta<typeof Form> = {
  title: 'Formily/JSON Schema Form Basic',
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

    return <JsonSchemaFormBasic schema={schema}></JsonSchemaFormBasic>;
  },
};

export const FormWithArrays: Story = {
  render: () => {
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
          'x-component': 'ArrayDialog',
        },
      },
    };

    return <JsonSchemaFormBasic schema={schema}></JsonSchemaFormBasic>;
  },
};

export const NestedObjectsForm: Story = {
  render: () => {
    const schema = {
      type: 'object',
      properties: {
        personalInfo: {
          type: 'object',
          title: 'Personal Information',
          properties: {
            firstName: {
              type: 'string',
              title: 'First Name',
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            dateOfBirth: {
              type: 'string',
              title: 'Date of Birth',
              format: 'date',
            },
          },
        },
        contact: {
          type: 'object',
          title: 'Contact Information',
          properties: {
            email: {
              type: 'string',
              title: 'Email',
            },
            phone: {
              type: 'string',
              title: 'Phone',
            },
          },
        },
      },
    };

    return <JsonSchemaFormBasic schema={schema}></JsonSchemaFormBasic>;
  },
};
