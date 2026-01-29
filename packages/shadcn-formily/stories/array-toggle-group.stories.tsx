/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import {
  createForm,
  defaultComponentRegistry,
  Form,
  JsonSchemaFormRenderer,
  SchemaField,
} from '../src';

const JSON_INDENT = 2;

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Toggle Group',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Basic: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        features: {
          type: 'array',
          title: 'Select features',
          items: {
            type: 'string',
            enum: [
              { label: 'Bold', value: 'bold' },
              { label: 'Italic', value: 'italic' },
              { label: 'Underline', value: 'underline' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
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

export const WithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      values: {
        textStyles: ['bold', 'italic'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        textStyles: {
          type: 'array',
          title: 'Text Styles',
          items: {
            type: 'string',
            enum: [
              { label: 'Bold', value: 'bold' },
              { label: 'Italic', value: 'italic' },
              { label: 'Underline', value: 'underline' },
              { label: 'Strikethrough', value: 'strikethrough' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
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
        tags: {
          type: 'array',
          title: 'Tags (at least one required)',
          required: true,
          items: {
            type: 'string',
            enum: [
              { label: 'Bug', value: 'bug' },
              { label: 'Feature', value: 'feature' },
              { label: 'Enhancement', value: 'enhancement' },
              { label: 'Documentation', value: 'documentation' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
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

export const WithCustomVariant: Story = {
  render: () => {
    const form = createForm({
      values: {
        priority: ['high'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        priority: {
          type: 'array',
          title: 'Priority Levels',
          items: {
            type: 'string',
            enum: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Critical', value: 'critical' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
          'x-component-props': {
            variant: 'outline',
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
          Submit
        </button>
      </Form>
    );
  },
};

export const WithDifferentSizes: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-6">
          <SchemaField>
            <SchemaField.Array
              name="small"
              title="Small Size"
              type="array"
              x-decorator="FormItem"
              x-component="ArrayToggleGroup"
              x-component-props={{
                size: 'sm',
                options: [
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ],
              }}
            />
            <SchemaField.Array
              name="default"
              title="Default Size"
              type="array"
              x-decorator="FormItem"
              x-component="ArrayToggleGroup"
              x-component-props={{
                size: 'default',
                options: [
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ],
              }}
            />
            <SchemaField.Array
              name="large"
              title="Large Size"
              type="array"
              x-decorator="FormItem"
              x-component="ArrayToggleGroup"
              x-component-props={{
                size: 'lg',
                options: [
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ],
              }}
            />
          </SchemaField>
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const JsonSchemaForm: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          title: 'Categories',
          items: {
            type: 'string',
            enum: [
              { label: 'Technology', value: 'tech' },
              { label: 'Design', value: 'design' },
              { label: 'Marketing', value: 'marketing' },
              { label: 'Sales', value: 'sales' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
        },
        permissions: {
          type: 'array',
          title: 'Permissions',
          items: {
            type: 'string',
            enum: [
              { label: 'Read', value: 'read' },
              { label: 'Write', value: 'write' },
              { label: 'Delete', value: 'delete' },
              { label: 'Admin', value: 'admin' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const form = createForm({
      values: {
        features: ['bold', 'italic'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        features: {
          type: 'array',
          title: 'Features (Disabled)',
          items: {
            type: 'string',
            enum: [
              { label: 'Bold', value: 'bold' },
              { label: 'Italic', value: 'italic' },
              { label: 'Underline', value: 'underline' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
          'x-component-props': {
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

export const ReadOnly: Story = {
  render: () => {
    const form = createForm({
      values: {
        status: ['active', 'verified'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        status: {
          type: 'array',
          title: 'Status (Read Only)',
          items: {
            type: 'string',
            enum: [
              { label: 'Active', value: 'active' },
              { label: 'Verified', value: 'verified' },
              { label: 'Premium', value: 'premium' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
          'x-component-props': {
            readOnly: true,
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

export const MultipleFields: Story = {
  render: () => {
    const form = createForm({
      values: {
        skills: ['javascript'],
        interests: ['music'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        skills: {
          type: 'array',
          title: 'Skills',
          items: {
            type: 'string',
            enum: [
              { label: 'JavaScript', value: 'javascript' },
              { label: 'TypeScript', value: 'typescript' },
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
        },
        interests: {
          type: 'array',
          title: 'Interests',
          items: {
            type: 'string',
            enum: [
              { label: 'Music', value: 'music' },
              { label: 'Sports', value: 'sports' },
              { label: 'Reading', value: 'reading' },
              { label: 'Gaming', value: 'gaming' },
              { label: 'Travel', value: 'travel' },
            ],
          },
          'x-decorator': 'FormItem',
          'x-component': 'ArrayToggleGroup',
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
          Submit
        </button>
      </Form>
    );
  },
};
