import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { JsonSchemaForm } from '../src';

const meta: Meta<typeof JsonSchemaForm> = {
  title: 'Formily/Form Settings',
  component: JsonSchemaForm,

  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <div className="w-full ">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JsonSchemaForm>;

export const JsonSchema: Story = {
  args: {
    layout: {
      density: 'responsive',
    },
  },
  render: (args) => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        inputContainer: {
          type: 'object',
          title: 'User Information',
          properties: {
            firstName: {
              type: 'string',
              title: 'First Name',
              required: true,
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
          },
        },
      },
    };

    return <JsonSchemaForm {...args} schema={schema}></JsonSchemaForm>;
  },
};

export const ShouldNotHaveLabel: Story = {
  args: {
    layout: {
      density: 'responsive',
    },
  },
  render: (args) => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        inputContainer: {
          type: 'object',
          title: false,
          properties: {
            firstName: {
              type: 'string',
              title: false,
              required: true,
            },
            lastName: {
              type: 'string',
              title: false,
            },
          },
        },
      },
    };

    return <JsonSchemaForm {...args} schema={schema}></JsonSchemaForm>;
  },
};
