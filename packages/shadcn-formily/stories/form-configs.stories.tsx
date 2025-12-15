import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { JsonSchemaFormRenderer } from '../src';

const meta: Meta<typeof JsonSchemaFormRenderer> = {
  title: 'Formily/Form Settings',
  component: JsonSchemaFormRenderer,

  tags: ['autodocs'],
  argTypes: {
    density: {
      control: { type: 'select' },
      options: ['responsive', 'compact', 'normal', 'comfortable'],
      description:
        'Space density mode. "responsive" uses responsive breakpoints: compact on mobile, normal on tablet, comfortable on desktop',
    },
    responsive: {
      mobile: {
        control: { type: 'select' },
        options: ['sm', 'md', 'lg'],
      },
      tablet: {
        control: { type: 'select' },
        options: ['sm', 'md', 'lg'],
      },
      desktop: {
        control: { type: 'select' },
        options: ['sm', 'md', 'lg'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full ">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JsonSchemaFormRenderer>;

export const JsonSchemaForm: Story = {
  args: {
    density: 'responsive',
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

    return <JsonSchemaFormRenderer {...args} schema={schema}></JsonSchemaFormRenderer>;
  },
};

export const ShouldNotHaveLabel: Story = {
  args: {
    density: 'responsive',
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

    return <JsonSchemaFormRenderer {...args} schema={schema}></JsonSchemaFormRenderer>;
  },
};
