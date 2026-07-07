import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IconPickerProps } from './IconPicker';
import { defineProps } from '@internal/mcp';

type IconPickerOwnProps = OwnProps<IconPickerProps, 'button'>;

export const meta: ComponentMeta<IconPickerOwnProps> = {
  name: 'IconPicker',
  category: 'Formily Inputs',
  description:
    'A Formily-connected icon picker for selecting icon names from configured icon sets.',
  htmlElement: 'button',
  props: defineProps<IconPickerOwnProps>({
    slots: 'Slot props for customizing internal rendered parts.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    emptyText: 'Forwarded to the underlying UI component.',
    showClearButton: 'Forwarded to the underlying UI component.',
    onOpenChange: 'Forwarded to the underlying UI component.',
    providers: 'Forwarded to the underlying UI component.',
    pickerMode: 'Forwarded to the underlying UI component.',
    popoverProps: 'Forwarded to the underlying UI component.',
    isLoading: 'Forwarded to the underlying UI component.',
    onProvidersLoaded: 'Forwarded to the underlying UI component.',
    showValueText: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="iconPicker" title="IconPicker" x-decorator="FormItem" x-component="IconPicker" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    iconPicker: {
      type: 'string',
      title: 'IconPicker',
      'x-decorator': 'FormItem',
      'x-component': 'IconPicker',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'icon', 'picker', 'select'],
};
