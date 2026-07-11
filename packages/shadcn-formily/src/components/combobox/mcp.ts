import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ComboboxProps } from './Combobox';
import { defineProps } from '@internal/mcp';

type ComboboxOwnProps = OwnProps<ComboboxProps, 'button'>;

export const meta: ComponentMeta<ComboboxOwnProps> = {
  name: 'Combobox',
  category: 'Formily Inputs',
  description:
    'A Formily-connected searchable select input that maps dataSource to combobox options.',
  htmlElement: 'button',
  props: defineProps<ComboboxOwnProps>({
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    emptyText: 'Forwarded to the underlying UI component.',
    searchPlaceholder: 'Forwarded to the underlying UI component.',
    commandProps:
      'Props forwarded to the underlying cmdk `Command` root, e.g. `filter`, `shouldFilter`, `loop`.',
    variant: {
      description: 'Controls the visual treatment of the trigger button.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"outline"',
    },
    size: {
      description: 'Controls the trigger button dimensions and icon-only sizing.',
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
    asChild: {
      description:
        'Render the trigger button behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="combobox" title="Combobox" x-decorator="FormItem" x-component="Combobox" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    combobox: {
      type: 'string',
      title: 'Combobox',
      'x-decorator': 'FormItem',
      'x-component': 'Combobox',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'combobox', 'select', 'search'],
};
