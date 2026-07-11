import type { ComponentMeta } from '@internal/mcp';
import type { ColorSelectProps } from './ColorSelect';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `ColorSelectProps` (including newly forwarded Radix
// Select.Root props) is a compile error until it is documented here. Radix
// Select.Root does not extend a native element, so `keyof` yields only real props.
type ColorSelectDocumentedProps = Extract<keyof ColorSelectProps, string>;

export const meta: ComponentMeta<ColorSelectDocumentedProps> = {
  name: 'ColorSelect',
  category: 'Forms',
  description:
    'A select dropdown whose options each render a color swatch beside their label, with configurable keyboard navigation.',
  props: defineProps<ColorSelectDocumentedProps>({
    className: 'Additional CSS class applied to the select trigger.',
    options:
      'Selectable color options as `{ label, value }[]` where value is a CSS color.',
    value: 'Controlled selected color value.',
    onChange: 'Called with the selected color value when it changes.',
    placeholder: 'Placeholder text shown before a value is selected.',
    keyboardMode: {
      description:
        'How arrow keys behave: "dropdown" opens the menu, "cycle" steps through options in place.',
      type: '"cycle" | "dropdown"',
      defaultValue: '"dropdown"',
    },
    contentProps: 'Props forwarded to the underlying select content popover.',
    id: 'Optional id attribute applied to the select trigger.',
    defaultValue: 'Uncontrolled initial selected color value.',
    open: {
      description: 'Controlled open state of the dropdown.',
      type: 'boolean',
    },
    defaultOpen: {
      description: 'Uncontrolled initial open state of the dropdown.',
      type: 'boolean',
    },
    onOpenChange: {
      description: 'Called when the dropdown opens or closes.',
      type: '(open: boolean) => void',
    },
    dir: {
      description: 'Reading direction of the dropdown.',
      type: '"ltr" | "rtl"',
    },
    name: 'Name used when the select participates in native form submission.',
    disabled: 'Disables the select trigger.',
    required: 'Marks the select as required.',
    autoComplete: 'Native autoComplete hint forwarded to the hidden form control.',
    form: 'Associates the hidden form control with a form by id when rendered outside it.',
  }),
  examples: [
    {
      title: 'Color select',
      code: '<ColorSelect value={color} onChange={setColor} options={[{ label: "Red", value: "#ef4444" }, { label: "Blue", value: "#3b82f6" }]} />',
    },
  ],
  related: ['ColorPicker', 'Select'],
  keywords: ['color', 'select', 'dropdown', 'swatch', 'form'],
};
