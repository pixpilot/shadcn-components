import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RichTextEditor } from '../src/rich-text-editor/RichTextEditor';

/**
 * A rich text editor component built with Tiptap.
 * Supports basic formatting and can be extended with additional extensions.
 */
const meta = {
  title: 'shadcn-ui/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Initial HTML content',
    },
    editable: {
      control: 'boolean',
      description: 'Whether the editor is editable',
      defaultValue: true,
    },
    showToolbar: {
      control: 'boolean',
      description: 'Whether to show the formatting toolbar',
      defaultValue: true,
    },
    toolbarItems: {
      control: 'object',
      description: 'Array of toolbar items to display',
    },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rich text editor with basic formatting
 */
export const Default: Story = {
  args: {
    value: '<p>Start typing here...</p>',
  },
};

/**
 * Editor with initial content
 */
export const WithContent: Story = {
  args: {
    value:
      '<h1>Welcome</h1><p>This is a <strong>rich text</strong> editor with <em>formatting</em> capabilities.</p><ul><li>Bullet points</li><li>More bullets</li></ul>',
  },
};

/**
 * Read-only editor
 */
export const ReadOnly: Story = {
  args: {
    value: '<p>This editor is read-only and cannot be edited.</p>',
    editable: false,
  },
};

/**
 * Editor without toolbar
 */
export const WithoutToolbar: Story = {
  args: {
    value: '<p>This editor has no toolbar - just plain text editing.</p>',
    showToolbar: false,
  },
};

/**
 * Editor with limited toolbar options
 */
export const LimitedToolbar: Story = {
  args: {
    value: '<p>This editor only shows bold and italic buttons.</p>',
    toolbarItems: ['bold', 'italic'],
  },
};

/**
 * Editor with custom toolbar options
 */
export const CustomToolbar: Story = {
  args: {
    value: '<p>This editor has custom buttons including a save button.</p>',
    toolbarItems: [
      'bold',
      'italic',
      '|',
      {
        icon: '💾',
        tooltip: 'Save',
        onClick: () => {
          console.warn('Save button clicked!');
        },
      },
    ],
  },
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
  render: function InteractiveEditor() {
    const [content, setContent] = useState('<p>Edit this content...</p>');

    return (
      <div className="space-y-4">
        <RichTextEditor value={content} onChange={setContent} />
        <div className="p-4 border rounded bg-muted">
          <h3 className="font-semibold mb-2">HTML Output:</h3>
          <pre className="text-sm whitespace-pre-wrap">{content}</pre>
        </div>
      </div>
    );
  },
};
