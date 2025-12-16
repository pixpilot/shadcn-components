import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { JsonSchemaForm } from '../src';

const meta: Meta = {
  title: 'Formily/Density Variants',
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
type Story = StoryObj;

const baseSchema: ISchema = {
  type: 'object',
  properties: {
    userInfo: {
      type: 'object',
      title: 'User Information',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
        },
        email: {
          type: 'string',
          title: 'Email',
        },
        phone: {
          type: 'string',
          title: 'Phone',
        },
      },
    },
  },
};

export const CompactDensity: Story = {
  render: () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Compact Density</h3>
      <p className="mb-4 text-sm text-gray-600">
        Smallest gaps and text size - ideal for dense information displays
      </p>
      <JsonSchemaForm schema={baseSchema} layout={{ density: 'compact' }} />
    </div>
  ),
};

export const NormalDensity: Story = {
  render: () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Normal Density</h3>
      <p className="mb-4 text-sm text-gray-600">
        Balanced spacing - default and recommended for most use cases
      </p>
      <JsonSchemaForm schema={baseSchema} layout={{ density: 'normal' }} />
    </div>
  ),
};

export const ComfortableDensity: Story = {
  render: () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Comfortable Density</h3>
      <p className="mb-4 text-sm text-gray-600">
        Larger gaps and text size - ideal for accessibility and readability
      </p>
      <JsonSchemaForm schema={baseSchema} layout={{ density: 'comfortable' }} />
    </div>
  ),
};

export const ResponsiveDensity: Story = {
  render: () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Responsive Density</h3>
      <p className="mb-4 text-sm text-gray-600">
        Automatically adjusts based on screen size - compact on mobile, comfortable on
        desktop
      </p>
      <JsonSchemaForm schema={baseSchema} layout={{ density: 'responsive' }} />
    </div>
  ),
};

export const AllDensitiesComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-2 font-semibold">Compact</h4>
        <JsonSchemaForm schema={baseSchema} layout={{ density: 'compact' }} />
      </div>

      <div className="border-t pt-8">
        <h4 className="mb-2 font-semibold">Normal</h4>
        <JsonSchemaForm schema={baseSchema} layout={{ density: 'normal' }} />
      </div>

      <div className="border-t pt-8">
        <h4 className="mb-2 font-semibold">Comfortable</h4>
        <JsonSchemaForm schema={baseSchema} layout={{ density: 'comfortable' }} />
      </div>

      <div className="border-t pt-8">
        <h4 className="mb-2 font-semibold">Responsive</h4>
        <JsonSchemaForm schema={baseSchema} layout={{ density: 'responsive' }} />
      </div>
    </div>
  ),
};

export const NestedObjectsDensity: Story = {
  render: () => {
    const nestedSchema: ISchema = {
      type: 'object',
      properties: {
        company: {
          type: 'object',
          title: 'Company Information',
          properties: {
            name: {
              type: 'string',
              title: 'Company Name',
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
                country: {
                  type: 'string',
                  title: 'Country',
                },
              },
            },
          },
        },
      },
    };

    return (
      <div className="w-lg">
        <h3 className="mb-4 text-lg font-semibold">
          Nested Objects - Comfortable Density
        </h3>
        <JsonSchemaForm schema={nestedSchema} layout={{ density: 'comfortable' }} />
      </div>
    );
  },
};
