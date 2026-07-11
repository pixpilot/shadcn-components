import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ArrayTagsProps } from './ArrayTags';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `ArrayTagsProps` is a compile error until it is documented
// here. `ArrayTagsProps` extends the native `div` props, so subtract that native
// surface. `onChange` is a native `div` event name this component redefines, so
// re-add it via the extra-props parameter.
type ArrayTagsProp = DocumentedProps<ArrayTagsProps, 'div', 'onChange'>;

export const meta: ComponentMeta<ArrayTagsProp> = {
  name: 'ArrayTags',
  category: 'Formily Arrays',
  description:
    'A Formily array field for simple string/number arrays, rendered as an editable tag input with keyboard and paste support.',
  htmlElement: 'div',
  props: defineProps<ArrayTagsProp>({
    value: 'Controlled array value for the tag input. Usually supplied by Formily.',
    onChange:
      'Called with the new array of values when tags change. Usually supplied by Formily.',
    options: 'Optional suggestion list shown while typing, as `{ label, value }[]`.',
    freeSolo: {
      description: 'Allow arbitrary tag values not present in `options`.',
      type: 'boolean',
      defaultValue: 'true',
    },
    label: 'Label content or accessible label for the tag input.',
    showLabel: {
      description: 'Hides the label element while keeping the `label` value available.',
      type: 'boolean',
      defaultValue: 'true',
    },
    slots:
      'Per-part prop overrides for the inline input, e.g. `{ list, label, item, input, addButton, clear }`.',
    addButtonVisibility: {
      description: 'When the inline add button is shown.',
      type: `'always' | 'touch' | 'never'`,
    },
    placeholder: {
      description: 'Placeholder shown in the tag input.',
      defaultValue: `'Add items...'`,
    },
    emptyText: {
      description: 'Text shown when there are no matching options.',
      defaultValue: `'No options found.'`,
    },
    disabled: 'Disables the tag input. Falls back to the field disabled state.',
    readOnly: 'Makes the tag input read-only. Falls back to the field read-only state.',
    maxTags: 'Maximum number of tags allowed. Falls back to the schema `maxItems`.',
    minTags: 'Minimum number of tags required.',
    allowDuplicates: {
      description: 'Allow duplicate tag values.',
      type: 'boolean',
      defaultValue: 'false',
    },
    editable: {
      description: 'Allow editing an existing tag in place.',
      type: 'boolean',
      defaultValue: 'false',
    },
    delimiter: {
      description: 'Character that splits pasted/typed text into multiple tags.',
      defaultValue: `','`,
    },
    addOnPaste: {
      description: 'Create tags from pasted text split by the delimiter.',
      type: 'boolean',
      defaultValue: 'true',
    },
    addOnTab: {
      description: 'Commit the current input as a tag when Tab is pressed.',
      type: 'boolean',
      defaultValue: 'true',
    },
    onValidate: 'Predicate that returns whether a candidate tag value is allowed.',
  }),
  examples: [
    {
      title: 'Tag input',
      code: `{
  type: 'array',
  title: 'Tags',
  'x-decorator': 'FormItem',
  'x-component': 'ArrayTags',
  'x-component-props': { placeholder: 'Add tags...', maxTags: 10 },
}`,
    },
  ],
  keywords: ['formily', 'array', 'tags', 'chips', 'string', 'input'],
  related: ['ArrayToggleGroup'],
};
