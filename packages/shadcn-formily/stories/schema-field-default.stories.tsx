import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createForm, Form } from '../src';
import { JsonSchemaField } from '../src/components/schema-field/schema-field';

const meta: Meta<typeof Form> = {
  title: 'Formily/Schema Field Default',
  component: Form,
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
type Story = StoryObj<typeof Form>;

export const DefaultForm: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-component-props': {
            placeholder: 'Enter your name',
          },
          required: true,
        },
        email: {
          type: 'string',
          title: 'Email',
          'x-component-props': {
            type: 'email',
            placeholder: 'Enter your email',
          },
          required: true,
        },
        age: {
          type: 'number',
          title: 'Age',
          minimum: 0,
          maximum: 120,
        },
        newsletter: {
          type: 'boolean',
          title: 'Subscribe to newsletter',
        },
        gender: {
          type: 'string',
          title: 'Gender',
          enum: ['male', 'female', 'other'],
          'x-component-props': {
            placeholder: 'Select gender',
          },
        },
        tags: {
          type: 'array',
          title: 'Tags',
          items: {
            type: 'string',
          },
          'x-component': 'TagsInput',
        },
        volume: {
          type: 'number',
          title: 'Volume',
          minimum: 0,
          maximum: 100,
          'x-component': 'Slider',
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaField schema={schema} />
      </Form>
    );
  },
};

export const FormWithCombobox: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          title: 'Country',
          enum: [
            'United States',
            'Canada',
            'Mexico',
            'United Kingdom',
            'France',
            'Germany',
          ],
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Select your country',
          },
        },
        favoriteColor: {
          type: 'string',
          title: 'Favorite Color',
          enum: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'],
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Choose a color',
            multiple: true,
          },
        },
        skills: {
          type: 'array',
          title: 'Skills',
          items: {
            type: 'string',
            enum: [
              'JavaScript',
              'TypeScript',
              'React',
              'Vue',
              'Angular',
              'Node.js',
              'Python',
              'Java',
            ],
          },
          'x-component': 'TagsInput',
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaField schema={schema} />
      </Form>
    );
  },
};

export const FormWithCustomComponents: Story = {
  render: () => {
    const form = createForm();

    // Custom component for demonstration
    const DEFAULT_VOLUME = 50;
    const CustomSlider = ({
      value,
      onChange,
      ...props
    }: {
      value?: number;
      onChange?: (value: number) => void;
      [key: string]: unknown;
    }) => (
      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <label htmlFor="custom-slider">Custom Volume Control: {value ?? 0}</label>
        <input
          {...props}
          id="custom-slider"
          type="range"
          min="0"
          max="100"
          value={value ?? DEFAULT_VOLUME}
          onChange={(e) => onChange?.(Number.parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: '8px' }}
        />
      </div>
    );

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        volume: {
          type: 'number',
          title: 'Volume',
          minimum: 0,
          maximum: 100,
          'x-component': 'CustomSlider',
        },
        tags: {
          type: 'array',
          title: 'Tags',
          items: {
            type: 'string',
          },
          'x-component': 'TagsInput',
        },
        agree: {
          type: 'boolean',
          title: 'I agree to terms',
        },
      },
    };

    const customComponents = {
      fields: {
        CustomSlider: { component: CustomSlider, decorator: 'FormItem' },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaField schema={schema} components={customComponents} />
      </Form>
    );
  },
};

export const FormWithValidation: Story = {
  render: () => {
    const form = createForm();
    const schema = {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: 'Username',
          required: true,
          minLength: 3,
          'x-component-props': {
            placeholder: 'At least 3 characters',
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          required: true,
          format: 'email',
          'x-component-props': {
            type: 'email',
          },
        },
        age: {
          type: 'number',
          title: 'Age',
          minimum: 18,
          maximum: 120,
          'x-component': 'Slider',
        },
        skills: {
          type: 'array',
          title: 'Skills',
          required: true,
          minItems: 1,
          items: {
            type: 'string',
            enum: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular'],
          },
          'x-component': 'TagsInput',
        },
      },
    };

    return (
      <Form form={form}>
        <JsonSchemaField schema={schema} />
      </Form>
    );
  },
};
