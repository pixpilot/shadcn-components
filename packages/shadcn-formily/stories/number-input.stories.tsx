/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
import type { ISchema } from '@formily/react';
import type { Meta, StoryObj } from '@storybook/react';
import { onFieldInputValueChange } from '@formily/core';
import { observer } from '@formily/react';
import { useMemo } from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/NumberInput',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicNumberInput: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            effects: () => {
              onFieldInputValueChange('*', (field) => {
                console.log('Field changed:', field.value);
              });
            },
          }),
        [],
      );

      const schema = {
        type: 'object',
        properties: {
          age: {
            type: 'number',
            title: 'Age',
            default: 25,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
          },
        },
      };

      return (
        <Form
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <SchemaField schema={schema} />
          <pre className="mt-4 text-sm">{JSON.stringify(form.values, null, 2)}</pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};

export const NumberInputWithValidation: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          quantity: {
            type: 'number',
            title: 'Quantity',
            default: 10,
            minimum: 1,
            maximum: 100,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
            'x-decorator-props': {
              tooltip: 'Enter a number between 1 and 100',
            },
          },
          price: {
            type: 'number',
            title: 'Price ($)',
            default: 29.99,
            minimum: 0,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
          },
        },
      };

      return (
        <Form
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <SchemaField schema={schema} />
          <pre className="mt-4 text-sm">{JSON.stringify(form.values, null, 2)}</pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};

export const MultipleNumberInputs: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          width: {
            type: 'number',
            title: 'Width (px)',
            default: 1920,
            minimum: 320,
            maximum: 3840,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
          },
          height: {
            type: 'number',
            title: 'Height (px)',
            default: 1080,
            minimum: 240,
            maximum: 2160,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
          },
          weight: {
            type: 'number',
            title: 'Weight (kg)',
            default: 70.5,
            minimum: 0,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
          },
        },
      };

      return (
        <Form
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <SchemaField schema={schema} />
          <pre className="mt-4 text-sm">{JSON.stringify(form.values, null, 2)}</pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};

export const DeclarativeNumberInput: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            values: {
              temperature: 20,
              percentage: 85,
            },
          }),
        [],
      );

      return (
        <Form
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Measurement Settings</h3>

            <SchemaField>
              <SchemaField.Number
                name="temperature"
                title="Temperature (°C)"
                x-decorator="FormItem"
                x-component="NumberInput"
                minimum={-50}
                maximum={50}
              />
              <SchemaField.Number
                name="percentage"
                title="Percentage (%)"
                x-decorator="FormItem"
                x-component="NumberInput"
                minimum={0}
                maximum={100}
              />
              <SchemaField.Number
                name="rating"
                title="Rating (1-5)"
                x-decorator="FormItem"
                x-component="NumberInput"
                default={3}
                minimum={1}
                maximum={5}
              />
            </SchemaField>
          </div>
          <pre className="mt-4 text-sm">{JSON.stringify(form.values, null, 2)}</pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};

export const WithSchemaMinMax: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema: ISchema = {
        type: 'object',
        properties: {
          opacity: {
            type: 'number',
            title: 'Opacity',
            minimum: 0,
            maximum: 1,
            default: 0.1,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
            'x-component-props': {
              step: 0.01,
            },
          },
          /**
           * Should override schema min/max with component props
           */
          percentage: {
            type: 'number',
            title: 'Percentage (%)',
            minimum: 0,
            maximum: 100,
            default: 0.5,
            'x-decorator': 'FormItem',
            'x-component': 'NumberInput',
            'x-component-props': {
              step: 0.01,
              min: 0,
              max: 1,
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
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <SchemaField schema={schema} />
          <pre className="mt-4 text-sm">{JSON.stringify(form.values, null, 2)}</pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};
