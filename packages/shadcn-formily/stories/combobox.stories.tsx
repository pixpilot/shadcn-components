/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Combobox',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicCombobox: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        framework: {
          type: 'string',
          title: 'Framework',
          'x-decorator': 'FormItem',
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Select framework...',
            searchPlaceholder: 'Search framework...',
            emptyText: 'No framework found.',
            options: [
              { label: 'Next.js', value: 'nextjs' },
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
              { label: 'Svelte', value: 'svelte' },
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

export const MultipleComboboxes: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          title: 'Programming Language',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Select language...',
            searchPlaceholder: 'Search language...',
            options: [
              { label: 'TypeScript', value: 'typescript' },
              { label: 'JavaScript', value: 'javascript' },
              { label: 'Python', value: 'python' },
              { label: 'Java', value: 'java' },
              { label: 'Go', value: 'go' },
              { label: 'Rust', value: 'rust' },
            ],
          },
        },
        country: {
          type: 'string',
          title: 'Country',
          'x-decorator': 'FormItem',
          'x-component': 'Combobox',
          'x-component-props': {
            placeholder: 'Select country...',
            searchPlaceholder: 'Search country...',
            options: [
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Canada', value: 'ca' },
              { label: 'Australia', value: 'au' },
              { label: 'Germany', value: 'de' },
              { label: 'France', value: 'fr' },
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

export const DeclarativeCombobox: Story = {
  render: () => {
    const form = createForm({
      values: {
        framework: 'react',
      },
    });

    const frameworks = [
      { label: 'Next.js', value: 'nextjs' },
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ];

    const databases = [
      { label: 'PostgreSQL', value: 'postgresql' },
      { label: 'MySQL', value: 'mysql' },
      { label: 'MongoDB', value: 'mongodb' },
      { label: 'Redis', value: 'redis' },
    ];

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
            name="framework"
            title="Framework"
            required
            x-decorator="FormItem"
            x-component="Combobox"
            x-component-props={{
              placeholder: 'Select framework...',
              searchPlaceholder: 'Search framework...',
              options: frameworks,
            }}
          />
          <SchemaField.String
            name="database"
            title="Database"
            x-decorator="FormItem"
            x-component="Combobox"
            x-component-props={{
              placeholder: 'Select database...',
              searchPlaceholder: 'Search database...',
              options: databases,
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
