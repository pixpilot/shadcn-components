/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { onFieldInputValueChange } from '@formily/core';
import { observer } from '@formily/react';
import { useMemo } from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/SliderSelect',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicSliderSelect: Story = {
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
          size: {
            type: 'string',
            title: 'Size',
            default: 'md',
            enum: ['sx', 'xs', 'sm', 'md', 'lg', 'xl'],
            'x-decorator': 'FormItem',
            'x-component': 'SliderSelect',
            'x-component-props': {
              showSelect: true,
            },
          },
        },
      };

      return (
        <Form
          form={form}
          className="w-[420px]"
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
