/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { Button } from '@pixpilot/shadcn';
import { createForm, Form, JsonSchemaFormExtended, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Tags',
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
 * Basic ArrayTags - Simple string array
 * Type and press Enter to add tags inline
 */
export const Basic: Story = {
  render: () => {
    const form = createForm({
      values: {
        tags: ['react', 'typescript', 'formily'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          title: 'Project Tags',
          description: 'Type and press Enter to add tags',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add tags...',
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
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags with max limit
 * Can only add up to 3 tags
 */
export const WithMinTagsRequired: Story = {
  render: () => {
    const form = createForm({
      values: {
        skills: ['JavaScript', 'React'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        skills: {
          type: 'array',
          title: 'Skills (Min 1, Max 3)',
          description: 'Add 1 to 3 skills',
          minItems: 2,
          // Formily's minItems validator (backed by the 'min' rule) intentionally skips validation
          // for "empty" values like []. To enforce at least one item, we must set required: true.
          // The minItems: 2 then ensures at least 2 items, and the x-validator provides a custom message.
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add skills...',
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          // eslint-disable-next-line ts/no-unsafe-call
          form
            .validate()
            .then(() => {
              console.log('Form submitted:', values);
              alert(JSON.stringify(values, null, JSON_INDENT));
            })
            .catch((error: any) => {
              console.error('Validation failed:', error);
            });
        }}
      >
        <SchemaField schema={schema} />
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags with schema maxItems and minItems
 * Max and min tags defined in JSON schema
 *
 * Note: Formily's built-in `min` rule (which backs `minItems`) intentionally
 * skips validation for "empty" values like `[]`. To enforce at least one
 * item, mark the field as required.
 */
export const WithMaxMinItems: Story = {
  render: () => {
    const form = createForm({
      values: {
        categories: ['tech', 'news'],
      },
    });

    const schema: ISchema = {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          title: 'Categories (Min 1, Max 3 from schema)',
          description: 'Min and max items defined in schema.minItems and schema.maxItems',
          required: true,
          minItems: 2,
          maxItems: 3,
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add categories...',
          },
          'x-validator': [
            {
              required: true,
              message: 'At least one item is required.',
            },
          ],
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        form={form}
        schema={schema}
        className="w-[600px]"
        onSubmit={(values) => {
          // eslint-disable-next-line ts/no-unsafe-call
          form
            .validate()
            .then(() => {
              console.log('Form submitted:', values);
              alert(JSON.stringify(values, null, JSON_INDENT));
            })
            .catch((error: any) => {
              console.error('Validation failed:', error);
            });
        }}
      >
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </JsonSchemaFormExtended>
    );
  },
};

/**
 * ArrayTags with paste support
 * Paste comma-separated values to add multiple tags at once
 */
export const WithPasteSupport: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          title: 'Keywords',
          description: 'Paste comma-separated values or type and press Enter/Tab',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add keywords...',
            addOnPaste: true,
            addOnTab: true,
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
        <div className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          Try pasting: <code>frontend, backend, devops, testing</code>
        </div>
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags with duplicates allowed
 */
export const AllowDuplicates: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: ['apple', 'banana'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          title: 'Items (Duplicates Allowed)',
          description: 'You can add the same item multiple times',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add items...',
            allowDuplicates: true,
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
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags with editable tags
 * Click on a tag to edit it inline
 */
export const EditableTags: Story = {
  render: () => {
    const form = createForm({
      values: {
        labels: ['feature', 'bug', 'enhancement'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        labels: {
          type: 'array',
          title: 'Issue Labels',
          description: 'Click on a tag to edit it',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add labels...',
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
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags with custom validation
 * Only allows tags that start with a letter and contain only alphanumeric characters
 */
export const WithValidation: Story = {
  render: () => {
    const form = createForm({
      values: {
        usernames: ['john_doe', 'jane123'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        usernames: {
          type: 'array',
          title: 'Usernames',
          description: 'Only alphanumeric and underscores allowed',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add usernames...',
            onValidate: (value: string) => {
              // Only allow alphanumeric and underscores
              return /^\w+$/u.test(value);
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
        <div className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          Try adding: <code>valid_user</code> ✓ or <code>invalid-user</code> ✗
        </div>
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags - Disabled state
 */
export const Disabled: Story = {
  render: () => {
    const form = createForm({
      values: {
        tags: ['readonly', 'disabled', 'tags'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          title: 'Disabled Tags',
          description: 'These tags cannot be modified',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add tags...',
            disabled: true,
          },
        },
      },
    };

    return (
      <Form form={form} className="w-[600px]">
        <SchemaField schema={schema} />
      </Form>
    );
  },
};

/**
 * ArrayTags - Read-only state
 */
export const ReadOnly: Story = {
  render: () => {
    const form = createForm({
      values: {
        tags: ['readonly', 'tags', 'example'],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          title: 'Read-Only Tags',
          description: 'These tags are read-only',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add tags...',
            readOnly: true,
          },
        },
      },
    };

    return (
      <Form form={form} className="w-[600px]">
        <SchemaField schema={schema} />
      </Form>
    );
  },
};

/**
 * ArrayTags - Number array
 * Demonstrates handling numeric values
 */
export const NumberArray: Story = {
  render: () => {
    const form = createForm({
      values: {
        ports: [3000, 8080, 8443],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        ports: {
          type: 'array',
          title: 'Port Numbers',
          description: 'Enter port numbers',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add port numbers...',
            onValidate: (value: string) => {
              // Only allow numbers
              const num = Number(value);
              return !Number.isNaN(num) && num > 0 && num <= 65535;
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
        <div className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          Valid port range: 1-65535
        </div>
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags - Multiple fields in a form
 */
export const MultipleFields: Story = {
  render: () => {
    const form = createForm({
      values: {
        categories: ['frontend', 'backend'],
        tags: ['typescript', 'react'],
        keywords: [],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          title: 'Categories',
          description: 'Project categories',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add categories...',
            maxTags: 3,
          },
        },
        tags: {
          type: 'array',
          title: 'Tags',
          description: 'Project tags',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add tags...',
            editable: true,
          },
        },
        keywords: {
          type: 'array',
          title: 'Keywords',
          description: 'SEO keywords',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'Add keywords...',
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
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};

/**
 * ArrayTags - Empty state
 */
export const EmptyState: Story = {
  render: () => {
    const form = createForm({
      values: {
        tags: [],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          title: 'Tags',
          description: 'Start typing to add tags',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTags',
          'x-component-props': {
            placeholder: 'No tags yet, add some...',
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
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </Form>
    );
  },
};
