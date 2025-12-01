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

  decorators: [(Story) => <div className="w-100">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Declarative: Story = {
  render: () => {
    const form = createForm({
      values: {},
    });

    return (
      <Form form={form}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Form Grid Example (Declarative)</h2>
        </div>

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
      type: 'object',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            minColumns: [4, 6, 10],
          },
          properties: {
            aaa: {
              type: 'string',
              title: 'AAA',
              'x-decorator': 'FormItem',
              'x-decorator-props': { className: 'col-span-2' },
              'x-component': 'Input',
            },
            bbb: {
              type: 'string',
              title: 'BBB',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            ccc: {
              type: 'string',
              title: 'CCC',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            ddd: {
              type: 'string',
              title: 'DDD',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            eee: {
              type: 'string',
              title: 'EEE',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            fff: {
              type: 'string',
              title: 'FFF',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            ggg: {
              type: 'string',
              title: 'GGG',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Form Grid Example (JSON Schema)</h2>
        </div>
        <SchemaField schema={schema} />
        <Button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
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
      </Form>
    );
  },
};
