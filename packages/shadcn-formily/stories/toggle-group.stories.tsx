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

export const MultipleSelection: Story = {
  render: () => {
    const form = createForm();

    /*
     * For ToggleGroup with type: 'multiple', enum must be on the field itself
     * (not inside items) so Formily auto-populates field.dataSource.
     * Use ArrayToggleGroup instead if you need items.enum support.
     */
    const schema = {
      type: 'object',
      properties: {
        features: {
          type: 'array',
          title: 'Select features',
          enum: [
            { label: 'Feature A', value: 'feature_a' },
            { label: 'Feature B', value: 'feature_b' },
            { label: 'Feature C', value: 'feature_c' },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            type: 'multiple',
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

export const SingleWithOptions: Story = {
  render: () => {
    const form = createForm();

    /*
     * Options can be passed directly via x-component-props instead of
     * using enum in the schema. Useful when options are dynamic or
     * the schema is shared without enum values.
     */
    const schema = {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          title: 'Select period',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            allowEmptySelection: false,
            options: [
              { label: 'Day', value: 'day' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
            ],
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

export const MultipleWithOptions: Story = {
  render: () => {
    const form = createForm();

    /*
     * Options passed via x-component-props also work for type: 'multiple'.
     * No need for enum or items in the schema at all.
     */
    const schema = {
      type: 'object',
      properties: {
        features: {
          type: 'array',
          title: 'Select features',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            type: 'multiple',
            options: [
              { label: 'Feature A', value: 'feature_a' },
              { label: 'Feature B', value: 'feature_b' },
              { label: 'Feature C', value: 'feature_c' },
            ],
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

export const MultipleWithDefault: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        features: ['feature_a', 'feature_c'],
      },
    });

    /*
     * Options passed via x-component-props also work for type: 'multiple'.
     * No need for enum or items in the schema at all.
     */
    const schema = {
      type: 'object',
      properties: {
        features: {
          type: 'array',
          title: 'Select features',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleGroup',
          'x-component-props': {
            type: 'multiple',
            options: [
              { label: 'Feature A', value: 'feature_a' },
              { label: 'Feature B', value: 'feature_b' },
              { label: 'Feature C', value: 'feature_c' },
            ],
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
