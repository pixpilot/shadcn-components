/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Row & Column Layout',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const JSON_INDENT = 2;

/**
 * Declarative approach using SchemaField with Row and Column as x-component
 * This example shows a user profile form with multi-column layout
 */
export const DeclarativeMultiColumn: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[800px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">User Profile</h3>

          <SchemaField>
            {/* First Row - Two equal columns */}
            <SchemaField.Void
              x-component="Row"
              x-component-props={{ className: 'gap-4' }}
            >
              <SchemaField.Void x-component="Column">
                <SchemaField.String
                  name="firstName"
                  title="First Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter first name' }}
                />
                <SchemaField.String
                  name="firstName2"
                  title="First Name 2"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter first name' }}
                />
              </SchemaField.Void>
              <SchemaField.Void x-component="Column">
                <SchemaField.String
                  name="lastName"
                  title="Last Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter last name' }}
                  x-reactions={{
                    target: 'lastName',
                    fulfill: {
                      state: {
                        decorator: ['FormItem', { asterisk: true }],
                      },
                    },
                  }}
                />
              </SchemaField.Void>
            </SchemaField.Void>
          </SchemaField>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit Profile
        </button>
      </Form>
    );
  },
};

/**
 * JSON Schema approach using Row and Column with SchemaField
 * This demonstrates how to create multi-column layouts using JSON schema
 */
export const JSONSchemaMultiColumn: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        // Personal Information Section
        personalInfo: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            className: 'space-y-4',
          },
          properties: {
            title: {
              type: 'void',
              'x-component': 'h3',
              'x-component-props': {
                children: 'Personal Information',
                className: 'text-lg font-medium',
              },
            },
            nameRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                className: 'gap-4',
              },
              properties: {
                firstName: {
                  type: 'string',
                  title: 'First Name',
                  required: true,
                  'x-decorator': 'Column',
                  'x-decorator-props': { className: 'flex-1' },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter first name',
                  },
                  'x-reactions': {
                    target: 'firstName',
                    fulfill: {
                      state: {
                        decorator: ['FormItem', { asterisk: true }],
                      },
                    },
                  },
                },
                lastName: {
                  type: 'string',
                  title: 'Last Name',
                  required: true,
                  'x-decorator': 'Column',
                  'x-decorator-props': { className: 'flex-1' },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter last name',
                  },
                  'x-reactions': {
                    target: 'lastName',
                    fulfill: {
                      state: {
                        decorator: ['FormItem', { asterisk: true }],
                      },
                    },
                  },
                },
              },
            },
            detailsRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                className: 'gap-4',
              },
              properties: {
                age: {
                  type: 'number',
                  title: 'Age',
                  'x-decorator': 'Column',
                  'x-decorator-props': { className: 'flex-1' },
                  'x-component': 'NumberInput',
                  'x-component-props': {
                    placeholder: 'Age',
                    min: 18,
                    max: 120,
                  },
                  'x-reactions': {
                    target: 'age',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
                gender: {
                  type: 'string',
                  title: 'Gender',
                  'x-decorator': 'Column',
                  'x-decorator-props': { className: 'flex-1' },
                  'x-component': 'Select',
                  enum: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ],
                  'x-reactions': {
                    target: 'gender',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
                country: {
                  type: 'string',
                  title: 'Country',
                  'x-decorator': 'Column',
                  'x-decorator-props': { className: 'flex-1' },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Country',
                  },
                  'x-reactions': {
                    target: 'country',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
              },
            },
            contactRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                gutter: 16,
              },
              properties: {
                email: {
                  type: 'string',
                  title: 'Email Address',
                  required: true,
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 16 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'user@example.com',
                    type: 'email',
                  },
                  'x-reactions': {
                    target: 'email',
                    fulfill: {
                      state: {
                        decorator: ['FormItem', { asterisk: true }],
                      },
                    },
                  },
                },
                phone: {
                  type: 'string',
                  title: 'Phone',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 8 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Phone number',
                  },
                  'x-reactions': {
                    target: 'phone',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
              },
            },
            bioRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                gutter: 16,
              },
              properties: {
                bio: {
                  type: 'string',
                  title: 'Biography',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 24 },
                  'x-component': 'Textarea',
                  'x-component-props': {
                    placeholder: 'Write your bio...',
                    rows: 4,
                  },
                  'x-reactions': {
                    target: 'bio',
                    fulfill: {
                      state: {
                        decorator: [
                          'FormItem',
                          { description: 'Tell us about yourself' },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        // Address Section
        addressInfo: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            className: 'space-y-4 mt-6',
          },
          properties: {
            title: {
              type: 'void',
              'x-component': 'h4',
              'x-component-props': {
                children: 'Address Information',
                className: 'text-base font-medium',
              },
            },
            streetRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                gutter: 16,
              },
              properties: {
                street: {
                  type: 'string',
                  title: 'Street Address',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 24 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '123 Main St',
                  },
                  'x-reactions': {
                    target: 'street',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
              },
            },
            cityRow: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': {
                gutter: 16,
              },
              properties: {
                city: {
                  type: 'string',
                  title: 'City',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 12 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'City',
                  },
                  'x-reactions': {
                    target: 'city',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
                state: {
                  type: 'string',
                  title: 'State',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 6 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'State',
                  },
                  'x-reactions': {
                    target: 'state',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
                zipCode: {
                  type: 'string',
                  title: 'ZIP Code',
                  'x-decorator': 'Column',
                  'x-decorator-props': { span: 6 },
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '12345',
                  },
                  'x-reactions': {
                    target: 'zipCode',
                    fulfill: {
                      state: {
                        decorator: 'FormItem',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[800px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit Profile
        </button>
      </Form>
    );
  },
};

/**
 * Advanced layout with Tailwind classes for custom styling
 */
export const CustomStyledLayout: Story = {
  render: () => {
    const form = createForm();

    return (
      <Form
        form={form}
        className="w-[900px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Product Form</h3>

          <SchemaField>
            {/* Row with custom Tailwind classes */}
            <SchemaField.Void
              x-component="Row"
              x-component-props={{ className: 'items-end' }}
            >
              <SchemaField.String
                name="productName"
                title="Product Name"
                required
                x-decorator="Column"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter product name' }}
                x-reactions={{
                  target: 'productName',
                  fulfill: {
                    state: {
                      decorator: ['FormItem', { asterisk: true }],
                    },
                  },
                }}
              />
              <SchemaField.String
                name="sku"
                title="SKU"
                x-decorator="Column"
                x-decorator-props={{ className: 'font-mono' }}
                x-component="Input"
                x-component-props={{ placeholder: 'SKU-123' }}
                x-reactions={{
                  target: 'sku',
                  fulfill: {
                    state: {
                      decorator: 'FormItem',
                    },
                  },
                }}
              />
            </SchemaField.Void>

            {/* Four equal columns with flex-wrap */}
            <SchemaField.Void
              x-component="Row"
              x-component-props={{ className: 'flex-wrap' }}
            >
              <SchemaField.Number
                name="price"
                title="Price ($)"
                x-decorator="Column"
                x-component="NumberInput"
                x-component-props={{ placeholder: '0.00', min: 0, step: 0.01 }}
                x-reactions={{
                  target: 'price',
                  fulfill: {
                    state: {
                      decorator: 'FormItem',
                    },
                  },
                }}
              />
              <SchemaField.Number
                name="quantity"
                title="Quantity"
                x-decorator="Column"
                x-component="NumberInput"
                x-component-props={{ placeholder: '0', min: 0 }}
                x-reactions={{
                  target: 'quantity',
                  fulfill: {
                    state: {
                      decorator: 'FormItem',
                    },
                  },
                }}
              />
              <SchemaField.Number
                name="weight"
                title="Weight (kg)"
                x-decorator="Column"
                x-component="NumberInput"
                x-component-props={{ placeholder: '0.0', min: 0, step: 0.1 }}
                x-reactions={{
                  target: 'weight',
                  fulfill: {
                    state: {
                      decorator: 'FormItem',
                    },
                  },
                }}
              />
              <SchemaField.String
                name="category"
                title="Category"
                x-decorator="Column"
                x-component="Select"
                enum={[
                  { label: 'Electronics', value: 'electronics' },
                  { label: 'Clothing', value: 'clothing' },
                  { label: 'Books', value: 'books' },
                ]}
                x-reactions={{
                  target: 'category',
                  fulfill: {
                    state: {
                      decorator: 'FormItem',
                    },
                  },
                }}
              />
            </SchemaField.Void>

            {/* Full width description */}
            <SchemaField.Void x-component="Row">
              <SchemaField.String
                name="description"
                title="Product Description"
                x-decorator="Column"
                x-component="Textarea"
                x-component-props={{ placeholder: 'Describe your product...', rows: 5 }}
                x-reactions={{
                  target: 'description',
                  fulfill: {
                    state: {
                      decorator: [
                        'FormItem',
                        { description: 'Provide detailed product information' },
                      ],
                    },
                  },
                }}
              />
            </SchemaField.Void>
          </SchemaField>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Add Product
        </button>
      </Form>
    );
  },
};
