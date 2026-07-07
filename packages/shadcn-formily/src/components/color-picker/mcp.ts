import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ColorPickerProps } from './ColorPicker';
import { defineProps } from '@internal/mcp';

type ColorPickerOwnProps = OwnProps<ColorPickerProps, 'div'>;

export const meta: ComponentMeta<ColorPickerOwnProps> = {
  name: 'ColorPicker',
  category: 'Formily Inputs',
  description: 'A Formily-connected color picker for selecting color values.',
  htmlElement: 'div',
  props: defineProps<ColorPickerOwnProps>({
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    defaultOpen: 'Forwarded to the underlying UI component.',
    open: 'Forwarded to the underlying UI component.',
    onOpenChange: 'Forwarded to the underlying UI component.',
    modal: 'Forwarded to the underlying UI component.',
    value: 'Controlled value. Usually supplied by Formily.',
    format: 'Forwarded to the underlying UI component.',
    defaultFormat: 'Forwarded to the underlying UI component.',
    onFormatChange: 'Forwarded to the underlying UI component.',
    name: 'HTML/form name forwarded to the underlying control.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    inline: 'Forwarded to the underlying UI component.',
    readOnly:
      'Makes the control read-only. Usually also respects the Formily field read-only state.',
    required: 'Marks the control as required for accessibility and UI state.',
    presetColors: 'Forwarded to the underlying UI component.',
    layout: 'Layout settings passed into the form context.',
    sections: 'Forwarded to the underlying UI component.',
    contentProps: 'Forwarded to the underlying UI component.',
    variant: 'Forwarded to the underlying UI component.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    formatDisplayValue: 'Forwarded to the underlying UI component.',
    resetOptions: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="color" title="Color" x-decorator="FormItem" x-component="ColorPicker" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    color: {
      type: 'string',
      title: 'Color',
      'x-decorator': 'FormItem',
      'x-component': 'ColorPicker',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'color', 'picker'],
};
