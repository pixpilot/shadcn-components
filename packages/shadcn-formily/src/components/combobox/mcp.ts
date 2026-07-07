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
    label: 'Label content or accessible label for the component.',
    filter: 'Forwarded to the underlying UI component.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    loop: 'Forwarded to the underlying UI component.',
    emptyText: 'Forwarded to the underlying UI component.',
    shouldFilter: 'Forwarded to the underlying UI component.',
    disablePointerSelection: 'Forwarded to the underlying UI component.',
    vimBindings: 'Forwarded to the underlying UI component.',
    searchPlaceholder: 'Forwarded to the underlying UI component.',
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
