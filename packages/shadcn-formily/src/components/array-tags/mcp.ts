import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

type ArrayTagsProp =
  | 'placeholder'
  | 'emptyText'
  | 'disabled'
  | 'readOnly'
  | 'maxTags'
  | 'minTags'
  | 'allowDuplicates'
  | 'editable'
  | 'delimiter'
  | 'addOnPaste'
  | 'addOnTab'
  | 'onValidate';

export const meta: ComponentMeta<ArrayTagsProp> = {
  name: 'ArrayTags',
  category: 'Formily Arrays',
  description:
    'A Formily array field for simple string/number arrays, rendered as an editable tag input with keyboard and paste support.',
  htmlElement: 'div',
  props: defineProps<ArrayTagsProp>({
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
