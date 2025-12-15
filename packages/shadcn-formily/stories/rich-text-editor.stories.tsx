/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import {
  createForm,
  Form,
  JsonSchemaFormRenderer,
  RichTextEditor,
  SchemaFieldExtended,
} from '../src';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Formily/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Declarative: Story = {
  render: () => {
    const form = createForm({});

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="richText"
            title="Rich Text Editor"
            x-decorator="FormItem"
            x-component="RichTextEditor"
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

export const JsonSchemaForm: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        schema={schema}
        components={{
          fields: {
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const withFormConfig: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        schema={schema}
        components={{
          fields: {
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        settings={{
          richTextEditor: {
            toolbarOptions: [
              'bold',
              'italic',
              'underline',
              '|',
              'bulletList',
              'orderedList',
            ],
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const withFieldConfig: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
          'x-component-props': {
            toolbarOptions: [
              'bold',
              'italic',
              'underline',
              '|',
              'bulletList',
              'orderedList',
            ],
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        schema={schema}
        components={{
          fields: {
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};
