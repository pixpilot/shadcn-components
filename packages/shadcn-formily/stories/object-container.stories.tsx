import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { createForm, defaultComponentRegistry, JsonSchemaFormRenderer } from '../src';
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
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const NestedObject: Story = {
  render: () => {
    const form = createForm();
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

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const FlushLayout: Story = {
  render: () => {
    const form = createForm();
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
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: {
            ...defaultComponentRegistry,
            ObjectContainer: {
              component: (props) => <ObjectContainer {...props} variant="flat" />,
              decorator: 'FormItem',
            },
          },
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const FlushWithSurroundingFields: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        topField: {
          type: 'string',
          title: 'Top Field',
          required: true,
        },
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
          },
        },
        bottomField: {
          type: 'string',
          title: 'Bottom Field',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: {
            ...defaultComponentRegistry,
            ObjectContainer: {
              component: (props) => <ObjectContainer {...props} variant="flat" />,
              decorator: 'FormItem',
            },
          },
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const MultipleFlushObjects: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        billing: {
          type: 'object',
          title: 'Billing Address',
          properties: {
            street: { type: 'string', title: 'Street' },
            city: { type: 'string', title: 'City' },
          },
        },
        shipping: {
          type: 'object',
          title: 'Shipping Address',
          properties: {
            street: { type: 'string', title: 'Street' },
            city: { type: 'string', title: 'City' },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: {
            ...defaultComponentRegistry,
            ObjectContainer: {
              component: (props) => <ObjectContainer {...props} variant="flat" />,
              decorator: 'FormItem',
            },
          },
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const NestedMixedVariantsWithSurroundingFields: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        topField: {
          type: 'string',
          title: 'Top Field',
        },
        groupedParent: {
          type: 'object',
          title: 'Parent (Grouped)',
          // default is grouped, but explicit here for clarity
          'x-component-props': { variant: 'grouped' },
          properties: {
            parentField: {
              type: 'string',
              title: 'Parent Field',
            },
            flatChild: {
              type: 'object',
              title: 'Child (Flat)',
              'x-component-props': { variant: 'flat' },
              properties: {
                childField1: { type: 'string', title: 'Child Field 1' },
                childField2: { type: 'string', title: 'Child Field 2' },
              },
            },
          },
        },
        middleField: {
          type: 'string',
          title: 'Middle Field',
        },
        flatParent: {
          type: 'object',
          title: 'Parent (Flat)',
          'x-component-props': { variant: 'flat' },
          properties: {
            parentField: {
              type: 'string',
              title: 'Parent Field',
            },
            groupedChild: {
              type: 'object',
              title: 'Child (Grouped)',
              'x-component-props': { variant: 'grouped' },
              properties: {
                childField1: { type: 'string', title: 'Child Field 1' },
                childField2: { type: 'string', title: 'Child Field 2' },
              },
            },
          },
        },
        bottomField: {
          type: 'string',
          title: 'Bottom Field',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const NestedFlatParentAndChild: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        topField: {
          type: 'string',
          title: 'Top Field',
        },
        flatParent: {
          type: 'object',
          title: 'Parent (Flat)',
          'x-component-props': { variant: 'flat' },
          properties: {
            parentField: {
              type: 'string',
              title: 'Parent Field',
            },
            flatChild: {
              type: 'object',
              title: 'Child (Flat)',
              'x-component-props': { variant: 'flat' },
              properties: {
                childField1: { type: 'string', title: 'Child Field 1' },
                childField2: { type: 'string', title: 'Child Field 2' },
              },
            },
          },
        },
        bottomField: {
          type: 'string',
          title: 'Bottom Field',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const withoutObject: Story = {
  render: () => {
    const form = createForm();
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
        <JsonSchemaFormRenderer
          form={form}
          components={{
            fields: defaultComponentRegistry,
          }}
          schema={schema}
        ></JsonSchemaFormRenderer>
      </div>
    );
  },
};

export const CompactDensity: Story = {
  render: () => {
    const form = createForm();
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
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            email: {
              type: 'string',
              title: 'Email',
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const NormalDensity: Story = {
  render: () => {
    const form = createForm();
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
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            email: {
              type: 'string',
              title: 'Email',
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const ComfortableDensity: Story = {
  render: () => {
    const form = createForm();
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
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            email: {
              type: 'string',
              title: 'Email',
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const ResponsiveDensity: Story = {
  render: () => {
    const form = createForm();
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
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
            },
            email: {
              type: 'string',
              title: 'Email',
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      ></JsonSchemaFormRenderer>
    );
  },
};
