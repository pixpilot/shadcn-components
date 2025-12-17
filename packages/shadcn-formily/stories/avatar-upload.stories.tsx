/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, JsonSchemaFormExtended } from '../src';
import { SchemaFieldExtended } from '../src/components/schema-field';
import { handleUpload } from './utils/file-upload';

const meta: Meta<typeof Form> = {
  title: 'Formily/AvatarUpload',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const JSON_INDENT = 2;

export const Declarative: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="avatar"
            title="Avatar"
            required
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
            }}
          />
        </SchemaFieldExtended>
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

export const WithOnUploadInSchema: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'object',
          title: 'Profile Picture',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'AvatarUpload',
          'x-component-props': {
            accept: 'image/*',
            onUpload: handleUpload,
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
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended schema={schema} />
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

export const WithSize: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="smallAvatar"
            title="Small Avatar"
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
              size: 'sm',
            }}
          />
          <SchemaFieldExtended.String
            name="mediumAvatar"
            title="Medium Avatar"
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
              size: 'md',
            }}
          />
          <SchemaFieldExtended.String
            name="largeAvatar"
            title="Large Avatar"
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
              size: 'lg',
            }}
          />
        </SchemaFieldExtended>
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

export const WithValue: Story = {
  render: () => {
    const schema = {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'object',
          title: 'Profile Picture',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'AvatarUpload',
          'x-component-props': {
            accept: 'image/*',
            onUpload: handleUpload,
          },
          properties: {
            name: {
              type: 'string',
            },
            size: {
              type: 'number',
            },
            type: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            lastModified: { type: 'number' },
          },
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        schema={schema}
        values={{
          profilePicture: {
            name: 'avatar.png',
            size: 1024,
            type: 'image/png',
            url: `${window.location.origin}/avatar.png`,
            lastModified: 1625247600000,
          },
        }}
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
        }}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </JsonSchemaFormExtended>
    );
  },
};
