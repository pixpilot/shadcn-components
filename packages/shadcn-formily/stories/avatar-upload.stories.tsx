/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import type { AvatarUploadProps } from '../src';
import React from 'react';
import { AvatarUpload, createForm, Form, JsonSchemaFormExtended } from '../src';
import { SchemaFieldExtended } from '../src/components/schema-field';
import { stripExif } from './utils';
import { handleUpload, handleUploadWithError } from './utils/file-upload';

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

function withFallbackAvatarUrl(
  value: NonNullable<AvatarUploadProps['value']> | null,
): NonNullable<AvatarUploadProps['value']> | null {
  if (value == null) {
    return value;
  }

  const fallbackUrl = `${window.location.origin}/avatar.png`;

  return {
    ...value,
    url: value.url != null && value.url !== '' ? value.url : fallbackUrl,
  };
}

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
    const form = createForm({
      initialValues: {
        profilePicture: {
          name: 'avatar.png',
          size: 1024,
          type: 'image/png',
          url: `${window.location.origin}/avatar.png`,
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
 * Demonstrates that the form field value is only set **after** the upload
 * completes (`onSuccess` fires).  Select an image, wait for the progress bar
 * to reach 100 %, then click Submit — the logged values will contain the
 * file metadata.  If you submit before the upload finishes the field will
 * still be empty.
 */
export const UploadSuccess: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        avatar: {
          type: 'object',
          title: 'Avatar',
          'x-decorator': 'FormItem',
          'x-component': 'AvatarUpload',
          'x-component-props': {
            accept: 'image/*',
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
 * The field will display the error message beneath the avatar picker after
 * the simulated failure completes.
 */
export const UploadFailure: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        avatar: {
          type: 'object',
          title: 'Avatar',
          'x-decorator': 'FormItem',
          'x-component': 'AvatarUpload',
          'x-component-props': {
            accept: 'image/*',
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

const CustomFileUpload: React.FC<AvatarUploadProps> = (props) => {
  return <AvatarUpload {...props} mapValue={withFallbackAvatarUrl} />;
};

export const WithCustomComponent: Story = {
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

/**
 * Demonstrates the `clearable` prop in the Formily context.
 * The avatar field is pre-populated with an image and the × button is shown
 * by default. Clicking × sets the field value back to `null` so submitting
 * afterwards yields an empty object.
 */
export const WithClear: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        avatar: {
          name: 'avatar.png',
          size: 1024,
          type: 'image/png',
          url: `${window.location.origin}/avatar.png`,
          lastModified: 1625247600000,
        },
      },
    });

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
            title="Avatar (clearable)"
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
              clearable: true,
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

export const WithClearDisabled: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        avatar: {
          name: 'avatar.png',
          size: 1024,
          type: 'image/png',
          url: `${window.location.origin}/avatar.png`,
          lastModified: 1625247600000,
        },
      },
    });

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
            title="Avatar (clear disabled)"
            x-decorator="FormItem"
            x-component="AvatarUpload"
            x-component-props={{
              accept: 'image/*',
              onUpload: handleUpload,
              clearable: false,
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

export const WithMaxFileSize: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        avatar: {
          type: 'object',
          title: 'Avatar',
          'x-decorator': 'FormItem',
          'x-component': 'AvatarUpload',
          'x-component-props': {
            accept: 'image/*',
            maxSize: 1024 * 1024 * 1, // 1 MB
            clearable: true,
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

/**
 * Demonstrates EXIF stripping via `transformFile`.
 *
 * A thin wrapper component applies `stripExif` as a pre-accept transform so
 * the store always receives the clean file.  All callbacks — `onProgress`,
 * `onSuccess`, `onError` — are then called with the stripped file, and the
 * avatar preview also renders the stripped version from the start.
 */
const ExifStrippingAvatarUpload: React.FC<AvatarUploadProps> = (props) => {
  return <AvatarUpload {...props} transformFile={stripExif} />;
};

export const WithExifStrip: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        avatar: {
          type: 'object',
          title: 'Avatar',
          'x-decorator': 'FormItem',
          'x-component': 'ExifStrippingAvatarUpload',
          'x-component-props': {
            accept: 'image/*',
            maxSize: 1024 * 1024 * 1, // 1 MB
            clearable: true,
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
            ExifStrippingAvatarUpload: {
              component: ExifStrippingAvatarUpload,
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
