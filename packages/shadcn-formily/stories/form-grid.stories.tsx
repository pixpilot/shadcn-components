import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn-ui';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Form Grid',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Declarative: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          {
            name: 'Bob Builder',
            email: 'bob@example.com',
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact List (ArrayDialog)</h2>
        </div>
        <div className="w-100">
          <SchemaField>
            <SchemaField.Void
              x-component="FormGrid"
              x-component-props={{
                className: 'grid-cols-4',
              }}
            >
              <SchemaField.String
                name="aaa"
                title="aaa"
                x-decorator="FormItem"
                x-decorator-props={{ className: 'col-span-2' }}
                x-component="Input"
              />
              <SchemaField.String
                name="bbb"
                title="bbb"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="ccc"
                title="ccc"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="ddd"
                title="ddd"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="eee"
                title="eee"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="fff"
                title="fff"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="ggg"
                title="ggg"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaField.Void>
          </SchemaField>
        </div>
        <div className=" pt-4">
          <Button
            onClick={() => {
              form
                .submit()
                .then(() => {
                  // eslint-disable-next-line no-alert
                  alert(JSON.stringify(form.values, null, 2));
                })
                .catch(console.error);
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    );
  },
};

export const JsonSchema: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 3 },
      properties: {
        field1: {
          type: 'string',
          title: 'Field 1 (Span 2)',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 2 },
          'x-component': 'Input',
        },
        field2: {
          type: 'string',
          title: 'Field 2',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field3: {
          type: 'string',
          title: 'Field 3',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field4: {
          type: 'string',
          title: 'Field 4',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        field5: {
          type: 'string',
          title: 'Field 5 (Span 3)',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 3 },
          'x-component': 'Textarea',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[800px]"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </Form>
    );
  },
};
