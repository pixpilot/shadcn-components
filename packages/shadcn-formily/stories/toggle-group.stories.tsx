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
  title: 'Formily/ToggleGroup',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <div className="w-100">
  //       <Story />
  //     </div>
  //   ),
  // ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const SingleMode: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          title: 'Select period',
          enum: [
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            allowEmptySelection: false,
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

export const JsonSchemaForm: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          title: 'Select period',
          enum: [
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            allowEmptySelection: false,
          },
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
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      />
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        priority: {
          type: 'string',
          title: 'Priority (required)',
          required: true,
          enum: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            allowEmptySelection: false,
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
