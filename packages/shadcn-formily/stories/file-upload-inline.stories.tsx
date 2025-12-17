/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import {
  createForm,
  FileUploadInline,
  Form,
  FormItem,
  JsonSchemaFormRenderer,
  SchemaFieldExtended,
} from '../src';
import { ObjectContainer } from '../src/components/object-container';
import { handleUpload } from './utils/file-upload';

const meta: Meta<typeof Form> = {
  title: 'Formily/FileUploadInline',
  component: FileUploadInline,
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
            name="resume"
            title="Resume"
            required
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Upload resume',
              accept: '.pdf,.doc,.docx',
              onUpload: handleUpload,
            }}
          />
          <SchemaFieldExtended.String
            name="photo"
            title="Profile Photo"
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Select photo',
              accept: 'image/*',
              showIcon: true,
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

export const DeclarativeMultiple: Story = {
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
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="resume"
            title="Resume"
            required
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Upload resume',
              accept: '.pdf,.doc,.docx',
              multiple: true,
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
          type: 'string',
          title: 'Profile Picture',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Select image',
            accept: 'image/*',
            showIcon: true,
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

export const WithoutIcon: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        attachment: {
          type: 'string',
          title: 'Attachment',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Choose file',
            showIcon: false,
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

export const DisabledFileUpload: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          title: 'Document (Disabled)',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Browse file',
            disabled: true,
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

export const WithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        taxDocument: {
          type: 'string',
          title: 'Tax Document',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload tax document',
            accept: '.pdf',
          },
          'x-validator': [
            {
              required: true,
              message: 'Please upload your tax document',
            },
          ],
        },
        idProof: {
          type: 'string',
          title: 'ID Proof',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload ID',
            accept: 'image/*,.pdf',
          },
          'x-validator': [
            {
              required: true,
              message: 'ID proof is required',
            },
          ],
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
        }}
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

export const WithFormFieldSetting: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          title: 'Upload File',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Select file',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
        settings={{
          fileUpload: {
            onUpload: handleUpload,
            maxSize: 2 * 1024 * 1024,
          },
        }}
      >
        <SchemaFieldExtended schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit Application
        </button>
      </Form>
    );
  },
};

export const WithJsonSchemaFormRenderer: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          title: 'Upload File',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Select file',
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: {
            FileUploadInline: {
              component: FileUploadInline,
            },
            ObjectContainer: {
              component: ObjectContainer,
            },
            FormItem: {
              component: FormItem,
            },
          },
        }}
        schema={schema}
        className="w-[400px]"
        settings={{
          fileUpload: {
            onUpload: handleUpload,
            maxSize: 2 * 1024 * 1024,
          },
        }}
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
      </JsonSchemaFormRenderer>
    );
  },
};
