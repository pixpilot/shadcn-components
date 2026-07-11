import type { ComponentMeta } from '@internal/mcp';
import type { TagsInputProps } from './TagsInput';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `TagsInputProps` is a compile error until it is documented
// here.
type TagsInputDocumentedProps = Extract<keyof TagsInputProps, string>;

export const meta: ComponentMeta<TagsInputDocumentedProps> = {
  name: 'TagsInput',
  category: 'Forms',
  description:
    'An inline tags/multi-select input supporting free-text tags, an optional options dropdown, validation, paste parsing, and per-tag editing.',
  props: defineProps<TagsInputDocumentedProps>({
    id: 'Optional id attribute applied to the input element.',
    className: 'Additional CSS class applied to the input wrapper.',
    value: {
      description: 'Controlled list of tag values.',
      type: 'Array<string | number>',
    },
    onChange: {
      description: 'Called with the new list of tags when they change.',
      type: '(value: Array<string | number>) => void',
    },
    options:
      'Optional selectable options as `{ label, value }[]`. When provided, a dropdown is shown.',
    freeSolo: {
      description:
        'Allows arbitrary tags not present in `options` (MUI Autocomplete style).',
      type: 'boolean',
      defaultValue: 'true',
    },
    placeholder: {
      description: 'Placeholder for the tag input.',
      type: 'string',
      defaultValue: '"Add tags..."',
    },
    emptyText: {
      description: 'Message shown when the options dropdown has no matches.',
      type: 'string',
      defaultValue: '"No options found."',
    },
    disabled: 'Disables the input.',
    readOnly: 'Renders tags without allowing edits.',
    maxTags: 'Maximum number of tags allowed.',
    allowDuplicates: {
      description: 'Allows the same tag value to be added more than once.',
      type: 'boolean',
      defaultValue: 'false',
    },
    editable: {
      description: 'Allows editing an existing tag inline.',
      type: 'boolean',
      defaultValue: 'false',
    },
    label: 'Optional label rendered above the input.',
    showLabel: {
      description: 'Hides the label element while keeping the `label` value available.',
      type: 'boolean',
      defaultValue: 'true',
    },
    slots: {
      description:
        'Per-part prop overrides for the inline input, e.g. `{ list, label, item, input, addButton, clear }`.',
      type: '{ list?: { className?: string }; label?: object; item?: object; input?: object; addButton?: { className?: string }; clear?: object }',
    },
    delimiter: {
      description: 'Character that splits pasted or typed text into multiple tags.',
      type: 'string',
      defaultValue: '","',
    },
    addOnPaste: {
      description: 'Adds tags when pasting delimited text.',
      type: 'boolean',
      defaultValue: 'true',
    },
    addOnTab: {
      description: 'Commits the current input as a tag when pressing Tab.',
      type: 'boolean',
      defaultValue: 'true',
    },
    onValidate: {
      description: 'Custom validator returning false to reject a candidate tag.',
      type: '(value: string) => boolean',
    },
    addButtonVisibility: {
      description: 'When the inline add button is shown.',
      type: '"always" | "touch" | "never"',
      defaultValue: '"touch"',
    },
  }),
  examples: [
    {
      title: 'Free-text tags',
      code: '<TagsInput value={tags} onChange={setTags} placeholder="Add tags…" />',
    },
    {
      title: 'With options',
      code: '<TagsInput value={tags} onChange={setTags} options={options} freeSolo={false} />',
    },
  ],
  keywords: ['tags', 'input', 'multi-select', 'chips', 'form'],
};
