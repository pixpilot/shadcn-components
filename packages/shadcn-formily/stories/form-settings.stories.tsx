import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import type { ISchema } from '../src';
import { createForm, JsonSchemaForm } from '../src';

type StoryArgs = Partial<
  ComponentProps<typeof JsonSchemaForm> & {
    id?: string;
  }
>;

const meta: Meta<StoryArgs> = {
  title: 'Formily/Form Settings',
  component: JsonSchemaForm,

  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <div id="form-settings-div-1" className="w-full ">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const JsonSchema: Story = {
  args: {
    layout: {
      density: 'responsive',
    },
  },
  render: (args) => {
    const form = createForm();
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

    return (
      <JsonSchemaForm
        id="form-settings"
        {...args}
        schema={schema}
        form={form}
      ></JsonSchemaForm>
    );
  },
};

export const ShouldNotHaveLabel: Story = {
  args: {
    layout: {
      density: 'responsive',
    },
  },
  render: (args) => {
    const form = createForm();
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

    return <JsonSchemaForm {...args} schema={schema} form={form}></JsonSchemaForm>;
  },
};
