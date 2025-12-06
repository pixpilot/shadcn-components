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
      <div className="w-full max-w-lg">
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

export const NestedObject: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        userInfo: {
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
              required: true,
            },
            email: {
              type: 'string',
              title: 'Email',
              format: 'email',
            },
            address: {
              type: 'object',
              title: 'Address',
              properties: {
                street: {
                  type: 'string',
                  title: 'Street',
                },
                city: {
                  type: 'string',
                  title: 'City',
                },
                zipCode: {
                  type: 'string',
                  title: 'Zip Code',
                },
              },
            },
          },
        },
      },
    };

    return <JsonSchemaFormRenderer schema={schema}></JsonSchemaFormRenderer>;
  },
};

export const withoutObject: Story = {
  render: () => {
    const schema: ISchema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
        },
      },
    };

    return (
      <div>
        <h5 className="pb-5">Should not wrap with object container</h5>
        <JsonSchemaFormRenderer schema={schema}></JsonSchemaFormRenderer>
      </div>
    );
  },
};
