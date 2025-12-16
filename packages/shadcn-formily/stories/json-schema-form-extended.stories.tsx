import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Form } from '../src';
import { JsonSchemaFormExtended } from '../src/components/json-schema-form-renderer';
import { handleUpload } from './utils/file-upload';
import { iconProviders } from './utils/icon-providers';

const meta: Meta<typeof Form> = {
  title: 'Formily/JSON Schema Form Extended',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const ExtendedForm: Story = {
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

    return (
      <JsonSchemaFormExtended
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
          iconPicker: {
            providers: iconProviders,
          },
        }}
        schema={schema}
      ></JsonSchemaFormExtended>
    );
  },
};

export const FormWithAdvancedComponents: Story = {
  render: () => {
    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: 'Article Title',
        },
        content: {
          type: 'string',
          title: 'Content',
          'x-component': 'RichTextEditor',
        },
        featuredImage: {
          type: 'string',
          title: 'Featured Image',
          'x-component': 'FileUpload',
          'x-component-props': {
            accept: 'image/*',
            maxFiles: 1,
          },
        },
        attachments: {
          type: 'array',
          title: 'Attachments',
          items: {
            type: 'string',
          },
          'x-component': 'FileUploadInline',
        },
        icon: {
          type: 'string',
          title: 'Icon',
          'x-component': 'IconPicker',
        },
        tags: {
          type: 'array',
          title: 'Tags',
          items: {
            type: 'string',
          },
          'x-component': 'TagsInputInLine',
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
          iconPicker: {
            providers: iconProviders,
          },
        }}
        schema={schema}
      ></JsonSchemaFormExtended>
    );
  },
};

export const CompleteForm: Story = {
  render: () => {
    const schema = {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          title: 'Profile Information',
          properties: {
            firstName: {
              type: 'string',
              title: 'First Name',
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            avatar: {
              type: 'string',
              title: 'Avatar',
              'x-component': 'FileUpload',
              'x-component-props': {
                accept: 'image/*',
                maxFiles: 1,
              },
            },
            bio: {
              type: 'string',
              title: 'Bio',
              'x-component': 'Textarea',
            },
          },
        },
        preferences: {
          type: 'object',
          title: 'Preferences',
          properties: {
            theme: {
              type: 'string',
              title: 'Theme',
              enum: ['light', 'dark', 'auto'],
              'x-component': 'Select',
            },
            notifications: {
              type: 'boolean',
              title: 'Enable Notifications',
              'x-component': 'Switch',
            },
            volume: {
              type: 'number',
              title: 'Volume',
              minimum: 0,
              maximum: 100,
              'x-component': 'Slider',
            },
          },
        },
        projects: {
          type: 'array',
          title: 'Projects',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Project Name',
              },
              description: {
                type: 'string',
                title: 'Description',
                'x-component': 'Textarea',
              },
              technologies: {
                type: 'array',
                title: 'Technologies',
                items: {
                  type: 'string',
                },
                'x-component': 'TagsInput',
              },
              priority: {
                type: 'number',
                title: 'Priority',
                minimum: 1,
                maximum: 5,
                'x-component': 'Slider',
              },
            },
          },
          'x-component': 'ArrayCollapse',
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
          iconPicker: {
            providers: iconProviders,
          },
        }}
        schema={schema}
      ></JsonSchemaFormExtended>
    );
  },
};
