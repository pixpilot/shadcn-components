import type { Form } from '@formily/core';
import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { JsonSchemaForm } from '../src';
import { Hidden } from '../src/components/hidden';

const meta: Meta<typeof Form> = {
  title: 'Formily/Hidden',
  component: Hidden,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const JsonSchema: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        inputContainer: {
          type: 'object',
          title: 'User Information',
          description: 'Secret information will be hidden',
          properties: {
            firstName: {
              type: 'string',
              title: 'First Name',
              required: true,
            },
            secretToken: {
              type: 'string',
              title: 'Secret Token',
              'x-component': 'Hidden',
              default: 'my-secret-token',
            },
          },
        },
      },
    };

    return <JsonSchemaForm schema={schema}></JsonSchemaForm>;
  },
};
