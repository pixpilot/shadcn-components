/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { onFieldValueChange } from '@formily/core';
import { useState } from 'react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/ColorSelect',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicColorSelect: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        favoriteColor: {
          type: 'string',
          title: 'Favorite Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select a color',
            options: [
              { label: 'Red', value: '#ff0000' },
              { label: 'Blue', value: '#0000ff' },
              { label: 'Green', value: '#00ff00' },
              { label: 'Yellow', value: '#ffff00' },
              { label: 'Purple', value: '#800080' },
            ],
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

export const MultipleColorSelects: Story = {
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
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select primary color',
            options: [
              { label: 'Red', value: '#ef4444' },
              { label: 'Blue', value: '#3b82f6' },
              { label: 'Green', value: '#22c55e' },
              { label: 'Yellow', value: '#eab308' },
              { label: 'Purple', value: '#a855f7' },
            ],
          },
        },
        secondaryColor: {
          type: 'string',
          title: 'Secondary Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select secondary color',
            options: [
              { label: 'Orange', value: '#f97316' },
              { label: 'Pink', value: '#ec4899' },
              { label: 'Cyan', value: '#06b6d4' },
              { label: 'Lime', value: '#84cc16' },
              { label: 'Indigo', value: '#6366f1' },
            ],
          },
        },
        accentColor: {
          type: 'string',
          title: 'Accent Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select accent color',
            options: [
              { label: 'Amber', value: '#f59e0b' },
              { label: 'Teal', value: '#14b8a6' },
              { label: 'Rose', value: '#f43f5e' },
              { label: 'Violet', value: '#8b5cf6' },
              { label: 'Emerald', value: '#10b981' },
            ],
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

export const WithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        themeColor: '#3b82f6',
      },
    });

    const schema = {
      type: 'object',
      properties: {
        themeColor: {
          type: 'string',
          title: 'Theme Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select theme color',
            options: [
              { label: 'Red', value: '#ef4444' },
              { label: 'Blue', value: '#3b82f6' },
              { label: 'Green', value: '#22c55e' },
              { label: 'Purple', value: '#a855f7' },
              { label: 'Orange', value: '#f97316' },
            ],
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

export const WithValueChange: Story = {
  render: function Render() {
    const [selectedColor, setSelectedColor] = useState<string>('');

    const form = createForm({
      effects: () => {
        onFieldValueChange('brandColor', (field) => {
          setSelectedColor(field.value as string);
        });
      },
    });

    const schema = {
      type: 'object',
      properties: {
        brandColor: {
          type: 'string',
          title: 'Brand Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select brand color',
            options: [
              { label: 'Red', value: '#dc2626' },
              { label: 'Blue', value: '#2563eb' },
              { label: 'Green', value: '#16a34a' },
              { label: 'Yellow', value: '#ca8a04' },
              { label: 'Purple', value: '#9333ea' },
            ],
          },
        },
      },
    };

    return (
      <div className="space-y-4">
        <Form form={form} className="w-[400px]">
          <SchemaField schema={schema} />
        </Form>
        {selectedColor && (
          <div className="flex items-center gap-2 text-sm">
            <span>Selected color:</span>
            <div
              className="h-6 w-6 rounded border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="font-mono">{selectedColor}</span>
          </div>
        )}
      </div>
    );
  },
};

export const WithCustomColors: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        neutralColor: {
          type: 'string',
          title: 'Neutral Color',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select a neutral color',
            options: [
              { label: 'Slate', value: '#64748b' },
              { label: 'Gray', value: '#6b7280' },
              { label: 'Zinc', value: '#71717a' },
              { label: 'Neutral', value: '#737373' },
              { label: 'Stone', value: '#78716c' },
            ],
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

export const WithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        requiredColor: {
          type: 'string',
          title: 'Required Color',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'You must select a color',
            options: [
              { label: 'Red', value: '#ff0000' },
              { label: 'Blue', value: '#0000ff' },
              { label: 'Green', value: '#00ff00' },
              { label: 'Yellow', value: '#ffff00' },
              { label: 'Purple', value: '#800080' },
            ],
          },
          'x-validator': [
            {
              required: true,
              message: 'Please select a color',
            },
          ],
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

export const WithDescription: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        uiColor: {
          type: 'string',
          title: 'UI Theme Color',
          description: 'Choose a color that matches your brand identity',
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
          'x-component-props': {
            placeholder: 'Select UI color',
            options: [
              { label: 'Primary Blue', value: '#3b82f6' },
              { label: 'Success Green', value: '#22c55e' },
              { label: 'Warning Yellow', value: '#eab308' },
              { label: 'Danger Red', value: '#ef4444' },
              { label: 'Info Cyan', value: '#06b6d4' },
            ],
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
