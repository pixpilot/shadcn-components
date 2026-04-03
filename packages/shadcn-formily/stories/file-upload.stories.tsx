/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import type { FileUploadProps } from '../src';
import React from 'react';
import {
  createForm,
  FileUpload,
  Form,
  JsonSchemaFormExtended,
  JsonSchemaFormRenderer,
} from '../src';
import { SchemaFieldExtended } from '../src/components/schema-field';
import { handleUpload, handleUploadWithError } from './utils/file-upload';

const meta: Meta<typeof Form> = {
  title: 'Formily/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const JSON_INDENT = 2;

// eslint-disable-next-line no-magic-numbers
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024;

type SingleFileUploadProps = Exclude<FileUploadProps, { multiple: true }>;
type MultiFileUploadProps = Extract<FileUploadProps, { multiple: true }>;

function withFallbackUrl(
  value: NonNullable<SingleFileUploadProps['value']> | null,
): NonNullable<SingleFileUploadProps['value']> | null {
  if (value == null) {
    return value;
  }

  const fallbackUrl = `${window.location.origin}/avatar.png`;

  return {
    ...value,
    url: value.url != null && value.url !== '' ? value.url : fallbackUrl,
  };
}

const CustomFileUpload: React.FC<SingleFileUploadProps> = (props) => {
  return <FileUpload {...props} mapValue={withFallbackUrl} />;
};

const CustomMultipleFileUpload: React.FC<MultiFileUploadProps> = (props) => {
  const { onFileSuccess, onFileError, ...restProps } = props;

  return (
    <FileUpload
      {...restProps}
      multiple={true}
      onFileSuccess={(fileMeta) => {
        console.log('Uploaded file:', fileMeta.name);
        onFileSuccess?.(fileMeta);
      }}
      onFileError={(file, error) => {
        console.error('Upload failed:', file.name, error);
        onFileError?.(file, error);
      }}
    />
  );
};

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
            x-component="FileUpload"
            x-component-props={{
              accept: '.pdf,.doc,.docx',
              onUpload: handleUpload,
            }}
          />
          <SchemaFieldExtended.String
            name="photo"
            title="Profile Photo"
            x-decorator="FormItem"
            x-component="FileUpload"
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
            x-component="FileUpload"
            x-component-props={{
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
          'x-component': 'FileUpload',
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
          'x-component': 'FileUpload',
          'x-component-props': {
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
          'x-component': 'FileUpload',
          'x-component-props': {
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

export const WithFormFieldSetting: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          title: 'Upload File',
          'x-component': 'FileUpload',
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
            maxSize: DEFAULT_MAX_SIZE,
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
          'x-component': 'FileUpload',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        className="w-[400px]"
        components={{
          fields: {
            FileUpload: {
              component: FileUpload,
            },
          },
        }}
        settings={{
          fileUpload: {
            onUpload: handleUpload,
            maxSize: DEFAULT_MAX_SIZE,
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

/**
 * Demonstrates that the form field value is only set **after** the upload
 * completes (`onFileSuccess` fires).  Select a file, wait for the progress bar
 * to finish, then click Submit — the logged values will contain the file
 * metadata.  Submitting before completion leaves the field empty.
 */
export const UploadSuccess: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'object',
          title: 'Document',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUpload',
          'x-component-props': {
            accept: '.pdf,.doc,.docx',
          },
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        form={form}
        schema={schema}
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

/**
 * Demonstrates the error path: the mock upload handler always fails, which
 * triggers `field.setFeedback({ type: 'error', … })` via `mapUploadProps`.
 * The field will display the error message beneath the file picker after
 * the simulated failure completes.
 */
export const UploadFailure: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'object',
          title: 'Document',
          'x-decorator': 'FormItem',
          'x-component': 'FileUpload',
          'x-component-props': {
            accept: '.pdf,.doc,.docx',
          },
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        form={form}
        schema={schema}
        settings={{
          fileUpload: {
            onUpload: handleUploadWithError,
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

export const WithCustomMapValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        profilePicture: {
          name: 'avatar.png',
          size: 1024,
          type: 'image/png',
          lastModified: 1625247600000,
        },
      },
    });
    const schema = {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'object',
          title: 'Profile Picture',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'CustomFileUpload',
          'x-component-props': {
            accept: 'image/*',
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
        form={form}
        schema={schema}
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
        }}
        components={{
          fields: {
            CustomFileUpload: {
              component: CustomFileUpload,
            },
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

export const WithCustomMultipleComponent: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        documents: [
          {
            name: 'resume.pdf',
            size: 204800,
            type: 'application/pdf',
            url: `${window.location.origin}/resume.pdf`,
            lastModified: 1625247600000,
          },
          {
            name: 'cover-letter.docx',
            size: 102400,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            url: `${window.location.origin}/cover-letter.docx`,
            lastModified: 1625247601000,
          },
        ],
      },
    });
    const schema = {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          title: 'Documents',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'CustomMultipleFileUpload',
          'x-component-props': {
            accept: '.pdf,.doc,.docx',
            multiple: true,
          },
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              size: { type: 'number' },
              type: { type: 'string' },
              url: { type: 'string' },
              lastModified: { type: 'number' },
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        form={form}
        schema={schema}
        settings={{
          fileUpload: {
            onUpload: handleUpload,
          },
        }}
        components={{
          fields: {
            CustomMultipleFileUpload: {
              component: CustomMultipleFileUpload,
            },
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
          'x-component': 'FileUpload',
          'x-component-props': {
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
          'x-component': 'FileUpload',
          'x-component-props': {
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
