import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { JsonSchemaFormRenderer } from '../src';
import { ObjectContainer } from '../src/components/object-container';

const meta: Meta<typeof ObjectContainer> = {
  title: 'Formily/Object Container',
  component: ObjectContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ObjectContainer>;

export const JsonSchemaForm: Story = {
  render: () => {
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
          },
        },
      },
    };

    return <JsonSchemaFormRenderer schema={schema}></JsonSchemaFormRenderer>;
  },
};
