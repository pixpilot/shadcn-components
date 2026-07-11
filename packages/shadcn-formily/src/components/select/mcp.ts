import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SelectProps } from './Select';
import { defineProps } from '@internal/mcp';

type SelectOwnProps = OwnProps<SelectProps, 'button'>;

export const meta: ComponentMeta<SelectOwnProps> = {
  name: 'Select',
  category: 'Formily Inputs',
  description:
    'A Formily-connected select field that resolves schema enum/dataSource into shadcn select options.',
  htmlElement: 'button',
  props: defineProps<SelectOwnProps>({
    required: 'Marks the control as required for accessibility and UI state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    open: 'Forwarded to the underlying UI component.',
    onOpenChange: 'Forwarded to the underlying UI component.',
    size: {
      description: 'Controls the trigger height.',
      type: `'sm' | 'default'`,
      defaultValue: `'default'`,
    },
    asChild:
      'Render the trigger behavior and styles through the child element instead of a native button.',
    contentProps: 'Forwarded to the underlying UI component.',
    keyboardMode: 'Forwarded to the underlying UI component.',
    position: 'Forwarded to the underlying UI component.',
    clearable: 'Forwarded to the underlying UI component.',
    mapOption: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="select" title="Select" x-decorator="FormItem" x-component="Select" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    select: {
      type: 'string',
      title: 'Select',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'select', 'dropdown', 'options'],
};
