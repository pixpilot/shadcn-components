import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Form } from '../src';
import { JsonSchemaForm } from '../src/components/json-schema-form-renderer';

const meta: Meta<typeof Form> = {
  title: 'Formily/JSON Schema Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const DefaultForm: Story = {
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
        tags: {
          type: 'array',
          title: 'Tags',
          items: {
            type: 'string',
          },
          'x-component': 'TagsInput',
        },
        priority: {
          type: 'number',
          title: 'Priority',
          minimum: 1,
          maximum: 10,
          'x-component': 'Slider',
        },
        category: {
          type: 'string',
          title: 'Category',
          enum: ['personal', 'work', 'education', 'other'],
          'x-component-props': {
            placeholder: 'Select category',
          },
          'x-component': 'Combobox',
        },
      },
    };

    return <JsonSchemaForm schema={schema}></JsonSchemaForm>;
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
          'x-component': 'TagsInput',
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
                'x-component': 'Select',
              },
              experience: {
                type: 'number',
                title: 'Years of Experience',
                minimum: 0,
                maximum: 20,
                'x-component': 'Slider',
              },
            },
          },
          'x-component': 'ArrayCards',
        },
        projects: {
          type: 'array',
          title: 'Projects',
          items: {
            type: 'string',
          },
          'x-component': 'TagsInputInLine',
        },
      },
    };

    return <JsonSchemaForm schema={schema}></JsonSchemaForm>;
  },
};

export const ContactForm: Story = {
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
            email: {
              type: 'string',
              title: 'Email',
              'x-component-props': {
                type: 'email',
              },
            },
            phone: {
              type: 'string',
              title: 'Phone',
            },
            dateOfBirth: {
              type: 'string',
              title: 'Date of Birth',
              format: 'date',
            },
          },
        },
        preferences: {
          type: 'object',
          title: 'Preferences',
          properties: {
            newsletter: {
              type: 'boolean',
              title: 'Subscribe to newsletter',
            },
            contactMethod: {
              type: 'string',
              title: 'Preferred Contact Method',
              enum: ['email', 'phone', 'mail'],
              'x-component': 'Radio',
            },
            interests: {
              type: 'array',
              title: 'Interests',
              items: {
                type: 'string',
                enum: ['technology', 'sports', 'music', 'art', 'travel'],
              },
              'x-component': 'TagsInput',
            },
          },
        },
      },
    };

    return <JsonSchemaForm schema={schema}></JsonSchemaForm>;
  },
};
