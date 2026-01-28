/* eslint-disable no-alert */
/* eslint-disable ts/no-unsafe-assignment */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import {
  createForm,
  defaultComponentRegistry,
  Form,
  JsonSchemaFormRenderer,
  RichTextEditor,
  SchemaFieldExtended,
} from '../src';

/**
 * The RichTextEditor component is a Formily-wrapped rich text editor built with Tiptap.
 *
 * ## Features
 * - Rich text formatting (bold, italic, underline, etc.)
 * - Lists (bulleted and numbered)
 * - Headings
 * - Customizable toolbar options
 * - Support for custom toolbar buttons
 * - Integration with Formily form state
 *
 * ## Usage
 * The RichTextEditor can be configured at three levels (in order of precedence):
 * 1. Field level: `x-component-props` on the schema field
 * 2. Form level: `settings.richTextEditor` on the form context
 * 3. Component level: Props passed directly to the component
 */
const meta: Meta<typeof RichTextEditor> = {
  title: 'Formily/RichTextEditor',
  component: RichTextEditor,
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
type Story = StoryObj<typeof RichTextEditor>;

const BELL_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>';

const BROOM_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l9-9"/><path d="M14 4l6 6"/><path d="M13 5l6 6"/><path d="M2 20l5-1 1-5"/></svg>';

const HASH_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L8 21"/><path d="M16 3l-2 18"/><path d="M4 9h17"/><path d="M3 15h17"/></svg>';

const SAVE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>';

const SPARKLE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 6.5L20 12l-6.5 3.5L12 22l-1.5-6.5L4 12l6.5-3.5L12 2z"/></svg>';

export const Declarative: Story = {
  render: () => {
    const form = createForm({});

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="richText"
            title="Rich Text Editor"
            x-decorator="FormItem"
            x-component="RichTextEditor"
          />
        </SchemaFieldExtended>
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

export const JsonSchemaForm: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const withFormConfig: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        settings={{
          richTextEditor: {
            toolbarItems: [
              'bold',
              'italic',
              'underline',
              '|',
              'bulletList',
              'orderedList',
            ],
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

export const withFieldConfig: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
          'x-component-props': {
            toolbarItems: [
              'bold',
              'italic',
              'underline',
              '|',
              'bulletList',
              'orderedList',
            ],
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

/**
 * Story demonstrating the use of a custom toolbar button.
 *
 * Custom toolbar buttons can be added by passing objects with:
 * - `icon`: React node to display (can be an icon or text)
 * - `tooltip`: Text to show on hover
 * - `onClick`: Function to execute when clicked (receives the editor instance)
 * - `isActive`: Optional function to determine if button should be highlighted
 */
export const WithCustomToolbarButton: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor with Custom Button',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
          'x-component-props': {
            toolbarItems: [
              'bold',
              'italic',
              'underline',
              '|',
              'bulletList',
              'orderedList',
              '|',
              // Custom button example - Alert button
              {
                icon: BELL_ICON_SVG,
                tooltip: 'Show Content',
                onClick: (editor: any) => {
                  const html = editor.getHTML();
                  alert(`Current content:\n\n${html}`);
                },
              },
            ],
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

/**
 * Story with multiple custom toolbar buttons demonstrating various use cases.
 *
 * This example shows:
 * - A clear formatting button
 * - A custom save button
 * - A character count button
 * - Integration with form field value
 */
export const WithMultipleCustomButtons: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor with Multiple Custom Buttons',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
          'x-component-props': {
            toolbarItems: [
              'bold',
              'italic',
              'underline',
              '|',
              'heading1',
              'heading2',
              '|',
              'bulletList',
              'orderedList',
              '|',
              // Clear formatting button
              {
                icon: BROOM_ICON_SVG,
                tooltip: 'Clear All Formatting',
                onClick: (editor: any) => {
                  editor.chain().focus().clearNodes().unsetAllMarks().run();
                },
              },
              // Character count button
              {
                icon: HASH_ICON_SVG,
                tooltip: 'Show Character Count',
                onClick: (editor: any) => {
                  const count =
                    editor.storage.characterCount?.characters() ??
                    editor.getText().length;
                  alert(`Character count: ${count}`);
                },
              },
              // Save button
              {
                icon: SAVE_ICON_SVG,
                tooltip: 'Save Content',
                onClick: (editor: any) => {
                  const html = editor.getHTML();
                  console.log('Saving content:', html);
                  alert('Content saved! (Check console for details)');
                },
              },
            ],
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

/**
 * Story demonstrating custom buttons configured at the form settings level.
 *
 * This approach allows you to configure default toolbar options for all
 * RichTextEditor instances in your form via the `settings.richTextEditor` property.
 */
export const WithCustomButtonsInFormSettings: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText1: {
          type: 'string',
          title: 'First Editor',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
        richText2: {
          type: 'string',
          title: 'Second Editor (Same Custom Buttons)',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        settings={{
          richTextEditor: {
            toolbarItems: [
              'bold',
              'italic',
              '|',
              'bulletList',
              '|',
              {
                icon: SPARKLE_ICON_SVG,
                tooltip: 'Insert Template',
                onClick: (editor: any) => {
                  editor
                    .chain()
                    .focus()
                    .insertContent('<p><strong>Template:</strong> Your text here...</p>')
                    .run();
                },
              },
            ],
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

/**
 * Story demonstrating how to pass initial values to the RichTextEditor.
 *
 * This example shows how to set default content for the editor using form.setValues()
 * or by passing initial values when creating the form.
 */
export const WithInitialValue: Story = {
  render: () => {
    const form = createForm({
      values: {
        richText:
          '<h2>Welcome to the Rich Text Editor!</h2><p>This is some <strong>initial content</strong> with <em>formatting</em>.</p><ul><li>List item 1</li><li>List item 2</li></ul><p>You can edit this content or start fresh.</p>',
      },
    });

    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor with Initial Value',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};

/**
 * Story demonstrating the RichTextEditor with a placeholder text.
 *
 * The placeholder is displayed when the editor is empty and provides guidance to users.
 */
export const WithPlaceholder: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        richText: {
          type: 'string',
          title: 'Rich Text Editor with Placeholder',
          'x-decorator': 'FormItem',
          'x-component': 'RichTextEditor',
          'x-component-props': {
            placeholder: 'Start typing your rich text content here...',
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        schema={schema}
        components={{
          fields: {
            ...defaultComponentRegistry,
            RichTextEditor: {
              component: RichTextEditor,
            },
          },
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      ></JsonSchemaFormRenderer>
    );
  },
};
