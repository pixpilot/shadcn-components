/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { FileMetadata } from '@pixpilot/shadcn-ui';
import type { Meta, StoryObj } from '@storybook/react';
import type { FileUploadInlineProps } from '../src';
import React from 'react';
import {
  createForm,
  FileUploadInline,
  Form,
  FormItem,
  JsonSchemaFormExtended,
  JsonSchemaFormRenderer,
  SchemaFieldExtended,
} from '../src';
import { ObjectContainer } from '../src/components/ObjectContainer';
import { handleUpload, handleUploadWithError } from './utils/file-upload';

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

// eslint-disable-next-line no-magic-numbers
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024;

type SingleFileUploadInlineProps = Omit<
  FileUploadInlineProps,
  'mapValue' | 'multiple' | 'onChange' | 'value'
> & {
  mapValue?: (value: FileMetadata | null) => FileMetadata | null;
  multiple?: false;
  onChange?: (value: FileMetadata | null) => void;
  value?: FileMetadata | null;
};
type MultiFileUploadInlineProps = Extract<FileUploadInlineProps, { multiple: true }>;

function withFallbackUrl(value: FileMetadata | null): FileMetadata | null {
  if (value == null) {
    return value;
  }

  const fallbackUrl = `${window.location.origin}/avatar.png`;

  return {
    ...value,
    url: value.url != null && value.url !== '' ? value.url : fallbackUrl,
  };
}

const CustomFileUploadInline: React.FC<SingleFileUploadInlineProps> = (props) => {
  return <FileUploadInline {...props} mapValue={withFallbackUrl} />;
};

const CustomMultipleFileUploadInline: React.FC<MultiFileUploadInlineProps> = (props) => {
  const { onFileSuccess, onFileError, ...restProps } = props;

  return (
    <FileUploadInline
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
 * completes (`onSuccess` fires).  Select a file, wait for the progress bar
 * to finish, then click Submit — the logged values will contain the file
 * metadata.  Submitting before completion leaves the field empty.
 */
export const UploadSuccess: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        resume: {
          type: 'object',
          title: 'Resume',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload resume',
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
        resume: {
          type: 'object',
          title: 'Resume',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload resume',
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
          'x-component': 'CustomFileUploadInline',
          'x-component-props': {
            buttonText: 'Select image',
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
            CustomFileUploadInline: {
              component: CustomFileUploadInline,
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
          'x-component': 'CustomMultipleFileUploadInline',
          'x-component-props': {
            buttonText: 'Upload documents',
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
            CustomMultipleFileUploadInline: {
              component: CustomMultipleFileUploadInline,
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
