/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { onFieldValueChange } from '@formily/core';
import { useState } from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/ColorPicker',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicColorPicker: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        favoriteColor: {
          type: 'string',
          title: 'Favorite Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {
            placeholder: 'Pick your favorite color',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const WithButtonVariant: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        favoriteColor: {
          type: 'string',
          title: 'Favorite Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {
            placeholder: 'Pick your favorite color',
            variant: 'button',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const ColorPickerWithPreview: Story = {
  render: () => {
    const ColorPickerWithPreviewComponent = () => {
      const [selectedColor, setSelectedColor] = useState<string>('#000000');

      const form = createForm({
        effects() {
          // Listen for changes to the favoriteColor field
          onFieldValueChange('favoriteColor', (field) => {
            // eslint-disable-next-line ts/no-unsafe-argument
            setSelectedColor(field.value);
          });
        },
      });
      const schema = {
        type: 'object',
        properties: {
          favoriteColor: {
            type: 'string',
            title: 'Favorite Color',
            'x-decorator': 'FormItem',
            'x-component': 'ColorPicker',
            'x-component-props': {
              placeholder: 'Pick your favorite color',
            },
          },
        },
      };

      return (
        <div className="w-[400px]">
          {selectedColor && (
            <div
              className="mb-4 h-16 w-full rounded-md border"
              style={{ backgroundColor: selectedColor }}
              title={`Selected color: ${selectedColor}`}
            />
          )}
          <Form
            form={form}
            onSubmit={(values) => {
              console.log('Form submitted:', values);
              alert(JSON.stringify(values, null, 2));
            }}
          >
            <SchemaField schema={schema} />
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </button>
          </Form>
        </div>
      );
    };

    return <ColorPickerWithPreviewComponent />;
  },
};

export const MultipleColorPickers: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        primaryColor: {
          type: 'string',
          title: 'Primary Color',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {
            placeholder: 'Select primary color',
          },
        },
        secondaryColor: {
          type: 'string',
          title: 'Secondary Color',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {
            placeholder: 'Select secondary color',
          },
        },
        accentColor: {
          type: 'string',
          title: 'Accent Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {
            placeholder: 'Select accent color',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const DeclarativeColorPicker: Story = {
  render: () => {
    const form = createForm({
      values: {
        themeColor: '#3B82F6',
      },
    });

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaField>
          <SchemaField.String
            name="themeColor"
            title="Theme Color"
            required
            x-decorator="FormItem"
            x-component="ColorPicker"
            x-component-props={{
              placeholder: 'Select theme color',
            }}
          />
          <SchemaField.String
            name="backgroundColor"
            title="Background Color"
            x-decorator="FormItem"
            x-component="ColorPicker"
            x-component-props={{
              placeholder: 'Select background color',
            }}
          />
        </SchemaField>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};
