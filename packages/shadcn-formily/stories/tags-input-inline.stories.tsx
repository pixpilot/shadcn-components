/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/TagsInputInLine',
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
 * Basic inline tags input - Declarative mode
 * Type and press Enter to add tags inline
 */
export const Declarative: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        skills: {
          type: 'array',
          title: 'Skills',
          description: 'Type and press Enter to add tags inline',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add your skills...',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * JSON Schema mode with various features enabled
 */
export const JsonSchema: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          title: 'Project Tags',
          description: 'Type and press Enter, Tab, or paste comma-separated values',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add tags...',
            addOnTab: true,
            addOnPaste: true,
            delimiter: ',',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * With initial values
 */
export const WithInitialValues: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        technologies: ['React', 'TypeScript', 'Node.js'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        technologies: {
          type: 'array',
          title: 'Technologies',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add technologies...',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * Editable tags - double click to edit
 */
export const EditableTags: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        editableTags: {
          type: 'array',
          title: 'Editable Tags',
          description: 'Double-click a tag to edit it, or press Enter when highlighted',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add editable tags...',
            editable: true,
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * With validation - max 5 tags, minimum 3 characters
 */
export const WithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        validatedTags: {
          type: 'array',
          title: 'Validated Tags',
          description: 'Maximum 5 tags, minimum 3 characters each',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add tags (max 5)...',
            maxTags: 5,
            onValidate: (value: string) => {
              const MIN_TAG_LENGTH = 3;
              if (value.length < MIN_TAG_LENGTH) {
                return false;
              }
              return true;
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * Multiple fields with different configurations
 */
export const MultipleFields: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        skills: {
          type: 'array',
          title: 'Skills',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add your skills...',
          },
        },
        interests: {
          type: 'array',
          title: 'Interests',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add your interests...',
            editable: true,
          },
        },
        keywords: {
          type: 'array',
          title: 'Keywords (max 3)',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Add keywords...',
            maxTags: 3,
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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

/**
 * With Options - Select from predefined list with freeSolo enabled
 */
export const WithOptionsFreeSolo: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        technologies: {
          type: 'array',
          title: 'Technologies',
          description: 'Select from list or type your own (freeSolo: true)',
          'x-decorator': 'FormItem',
          'x-component': 'TagsInputInLine',
          'x-component-props': {
            placeholder: 'Select or add technologies...',
            searchPlaceholder: 'Search technologies...',
            emptyText: 'No technologies found',
            freeSolo: true,
            options: [
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue.js' },
              { value: 'angular', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'typescript', label: 'TypeScript' },
            ],
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
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
