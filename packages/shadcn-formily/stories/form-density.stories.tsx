import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { createForm, JsonSchemaForm } from '../src';

const meta: Meta = {
  title: 'Formily/Density Variants',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div id="form-density-div-1" className="w-full max-w-lg">
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
  render: () => {
    const form = createForm();
    return (
      <div id="form-density-div-2">
        <h3 id="form-density-h3-1" className="mb-4 text-lg font-semibold">
          Compact Density
        </h3>
        <p id="form-density-p-1" className="mb-4 text-sm text-gray-600">
          Smallest gaps and text size - ideal for dense information displays
        </p>
        <JsonSchemaForm
          id="form-density"
          form={form}
          schema={baseSchema}
          layout={{ density: 'compact' }}
        />
      </div>
    );
  },
};

export const NormalDensity: Story = {
  render: () => {
    const form = createForm();
    return (
      <div id="form-density-div-3">
        <h3 id="form-density-h3-2" className="mb-4 text-lg font-semibold">
          Normal Density
        </h3>
        <p id="form-density-p-2" className="mb-4 text-sm text-gray-600">
          Balanced spacing - default and recommended for most use cases
        </p>
        <JsonSchemaForm form={form} schema={baseSchema} layout={{ density: 'normal' }} />
      </div>
    );
  },
};

export const ComfortableDensity: Story = {
  render: () => {
    const form = createForm();
    return (
      <div id="form-density-div-4">
        <h3 id="form-density-h3-3" className="mb-4 text-lg font-semibold">
          Comfortable Density
        </h3>
        <p id="form-density-p-3" className="mb-4 text-sm text-gray-600">
          Larger gaps and text size - ideal for accessibility and readability
        </p>
        <JsonSchemaForm
          form={form}
          schema={baseSchema}
          layout={{ density: 'comfortable' }}
        />
      </div>
    );
  },
};

export const ResponsiveDensity: Story = {
  render: () => {
    const form = createForm();
    return (
      <div id="form-density-div-5">
        <h3 id="form-density-h3-4" className="mb-4 text-lg font-semibold">
          Responsive Density
        </h3>
        <p id="form-density-p-4" className="mb-4 text-sm text-gray-600">
          Automatically adjusts based on screen size - compact on mobile, comfortable on
          desktop
        </p>
        <JsonSchemaForm
          form={form}
          schema={baseSchema}
          layout={{ density: 'responsive' }}
        />
      </div>
    );
  },
};

export const AllDensitiesComparison: Story = {
  render: () => {
    const formCompact = createForm();
    const formNormal = createForm();
    const formComfortable = createForm();
    const formResponsive = createForm();
    return (
      <div id="form-density-div-6" className="space-y-8">
        <div id="form-density-div-7">
          <h4 id="form-density-h4-1" className="mb-2 font-semibold">
            Compact
          </h4>
          <JsonSchemaForm
            form={formCompact}
            schema={baseSchema}
            layout={{ density: 'compact' }}
          />
        </div>

        <div id="form-density-div-8" className="border-t pt-8">
          <h4 id="form-density-h4-2" className="mb-2 font-semibold">
            Normal
          </h4>
          <JsonSchemaForm
            form={formNormal}
            schema={baseSchema}
            layout={{ density: 'normal' }}
          />
        </div>

        <div id="form-density-div-9" className="border-t pt-8">
          <h4 id="form-density-h4-3" className="mb-2 font-semibold">
            Comfortable
          </h4>
          <JsonSchemaForm
            form={formComfortable}
            schema={baseSchema}
            layout={{ density: 'comfortable' }}
          />
        </div>

        <div id="form-density-div-10" className="border-t pt-8">
          <h4 id="form-density-h4-4" className="mb-2 font-semibold">
            Responsive
          </h4>
          <JsonSchemaForm
            form={formResponsive}
            schema={baseSchema}
            layout={{ density: 'responsive' }}
          />
        </div>
      </div>
    );
  },
};

export const NestedObjectsDensity: Story = {
  render: () => {
    const form = createForm();
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
      <div id="form-density-div-11" className="w-lg">
        <h3 id="form-density-h3-5" className="mb-4 text-lg font-semibold">
          Nested Objects - Comfortable Density
        </h3>
        <JsonSchemaForm
          form={form}
          schema={nestedSchema}
          layout={{ density: 'comfortable' }}
        />
      </div>
    );
  },
};
