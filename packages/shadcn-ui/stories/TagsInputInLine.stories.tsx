import type { Meta, StoryObj } from '@storybook/react';
import type { TagsInputProps } from '../src/tags-input';
import { useState } from 'react';
import { TagsInput } from '../src/tags-input';

/**
 * An inline tags input component with dropdown suggestions and free-form entry.
 * Displays tags inline with an input field for adding new tags.
 */
const meta = {
  title: 'shadcn-ui/TagsInputInLine',
  component: TagsInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    emptyText: {
      control: 'text',
      description: 'Text shown when no options match the search',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    maxTags: {
      control: 'number',
      description: 'Maximum number of tags allowed',
    },
    allowDuplicates: {
      control: 'boolean',
      description: 'Whether duplicate tags are allowed',
    },
    freeSolo: {
      control: 'boolean',
      description: 'Whether to allow free-form tag creation',
    },
    editable: {
      control: 'boolean',
      description: 'Whether tags can be edited inline',
    },
    label: {
      control: 'text',
      description: 'Label for the input field',
    },
    addButtonVisibility: {
      control: 'inline-radio',
      options: ['always', 'touch', 'never'],
      description: 'Controls when the Add button is visible',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tags input inline with options
 */
export const WithOptions: Story = {
  args: {
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'typescript', label: 'TypeScript' },
    ],
    placeholder: 'Add technologies...',
    emptyText: 'No technologies found.',
    freeSolo: true,
  },
  render: function WithOptionsTagsInputInline(args: TagsInputProps) {
    const [value, setValue] = useState<Array<string | number>>([]);

    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Tags input inline with pre-selected values
 */
export const WithValue: Story = {
  args: {
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
    ],
    placeholder: 'Select languages...',
    freeSolo: false,
  },
  render: function WithValueTagsInputInline(args: TagsInputProps) {
    const [value, setValue] = useState<Array<string | number>>(['javascript', 'python']);

    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Free-form tags input inline
 */
export const FreeForm: Story = {
  args: {
    placeholder: 'Type and press Enter or comma...',
    freeSolo: true,
    addOnPaste: true,
    addButtonVisibility: 'always',
  },
  render: function FreeFormTagsInputInline(args: TagsInputProps) {
    const [value, setValue] = useState<Array<string | number>>([]);

    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
};
