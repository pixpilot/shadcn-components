import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ToggleGroupBaseProps } from './ToggleGroup';
import { defineProps } from '@internal/mcp';

type ToggleGroupOwnProps = OwnProps<ToggleGroupBaseProps, 'div'>;

export const meta: ComponentMeta<ToggleGroupOwnProps> = {
  name: 'ToggleGroup',
  category: 'Formily Inputs',
  description:
    'A Formily-connected segmented choice control for single or multiple option selection.',
  htmlElement: 'div',
  props: defineProps<ToggleGroupOwnProps>({
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    slots: 'Slot props for customizing internal rendered parts.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    type: 'Selection mode for the component.',
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    rovingFocus: 'Forwarded to the underlying UI component.',
    loop: 'Forwarded to the underlying UI component.',
    orientation: 'Forwarded to the underlying UI component.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    size: 'Size forwarded to the underlying UI component.',
    spacing: 'Forwarded to the underlying UI component.',
    allowEmptySelection: 'Allows clearing the current selection when supported.',
    fullWidth: 'Makes the control stretch to the available width.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="toggleGroup" title="ToggleGroup" x-decorator="FormItem" x-component="ToggleGroup" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    toggleGroup: {
      type: 'string',
      title: 'ToggleGroup',
      'x-decorator': 'FormItem',
      'x-component': 'ToggleGroup',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'toggle group', 'segmented', 'options'],
};
