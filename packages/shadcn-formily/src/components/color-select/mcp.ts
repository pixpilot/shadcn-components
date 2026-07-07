import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ColorSelectProps } from './ColorSelect';
import { defineProps } from '@internal/mcp';

type ColorSelectOwnProps = OwnProps<ColorSelectProps, 'button'>;

export const meta: ComponentMeta<ColorSelectOwnProps> = {
  name: 'ColorSelect',
  category: 'Formily Inputs',
  description:
    'A Formily-connected color select field that reads Formily dataSource as color options.',
  htmlElement: 'button',
  props: defineProps<ColorSelectOwnProps>({
    required: 'Marks the control as required for accessibility and UI state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    autoComplete: 'Forwarded to the underlying UI component.',
    open: 'Forwarded to the underlying UI component.',
    defaultOpen: 'Forwarded to the underlying UI component.',
    onOpenChange: 'Forwarded to the underlying UI component.',
    contentProps: 'Forwarded to the underlying UI component.',
    keyboardMode: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="colorSelect" title="ColorSelect" x-decorator="FormItem" x-component="ColorSelect" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    colorSelect: {
      type: 'string',
      title: 'ColorSelect',
      'x-decorator': 'FormItem',
      'x-component': 'ColorSelect',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'color', 'select', 'options'],
};
