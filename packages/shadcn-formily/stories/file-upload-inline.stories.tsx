/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/FileUploadInline',
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
        <SchemaField>
          <SchemaField.String
            name="resume"
            title="Resume"
            required
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Upload resume',
              accept: '.pdf,.doc,.docx',
            }}
          />
          <SchemaField.String
            name="coverLetter"
            title="Cover Letter"
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Upload cover letter (optional)',
              accept: '.pdf,.doc,.docx',
            }}
          />
          <SchemaField.String
            name="photo"
            title="Profile Photo"
            x-decorator="FormItem"
            x-component="FileUploadInline"
            x-component-props={{
              buttonText: 'Select photo',
              accept: 'image/*',
              showIcon: true,
            }}
          />
        </SchemaField>
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
      >
        <SchemaField>
          <SchemaField.String
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
        </SchemaField>
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

export const BasicFileUpload: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          title: 'Upload Document',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Browse file',
            showIcon: true,
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

export const MultipleFileUploads: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        resume: {
          type: 'string',
          title: 'Resume',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload resume',
            accept: '.pdf,.doc,.docx',
          },
        },
        coverLetter: {
          type: 'string',
          title: 'Cover Letter',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload cover letter',
            accept: '.pdf,.doc,.docx',
          },
        },
        portfolio: {
          type: 'string',
          title: 'Portfolio (Optional)',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload portfolio',
            accept: '.pdf',
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

export const ImageUpload: Story = {
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
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

export const ComplexForm: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        personalInfo: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            minColumns: 1,
            maxColumns: 2,
          },
          properties: {
            firstName: {
              type: 'string',
              title: 'First Name',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: 'Enter first name',
              },
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: 'Enter last name',
              },
            },
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: 'your.email@example.com',
            type: 'email',
          },
        },
        resume: {
          type: 'string',
          title: 'Resume/CV',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload your resume',
            accept: '.pdf,.doc,.docx',
          },
        },
        coverLetter: {
          type: 'string',
          title: 'Cover Letter',
          'x-decorator': 'FormItem',
          'x-component': 'FileUploadInline',
          'x-component-props': {
            buttonText: 'Upload cover letter (optional)',
            accept: '.pdf,.doc,.docx',
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
      >
        <SchemaField schema={schema} />
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
