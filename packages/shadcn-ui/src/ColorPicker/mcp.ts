import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ColorPickerProps } from './ColorPicker';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that a
// newly forwarded prop is a compile error until it is documented here. The props
// chain down to the Radix ColorPicker root, which extends the native `div`
// props, so subtract that native surface. `onChange` is a native `div` event
// name this component redefines as the value-change callback, so re-add it via
// the extra-props parameter.
type ColorPickerDocumentedProps = DocumentedProps<ColorPickerProps, 'div', 'onChange'>;

export const meta: ComponentMeta<ColorPickerDocumentedProps> = {
  name: 'ColorPicker',
  category: 'Forms',
  description:
    'A color picker field rendered as either an input or a button trigger, with swatch, picker, format select, and reset support.',
  htmlElement: 'div',
  props: defineProps<ColorPickerDocumentedProps>({
    variant: {
      description: 'Renders the trigger as a text input or a color swatch button.',
      type: '"button" | "input"',
      defaultValue: '"input"',
    },
    placeholder: 'Placeholder text shown before a color is selected.',
    formatDisplayValue:
      'Formats the displayed value for the button variant, e.g. to show a color name instead of the raw hex.',
    resetOptions:
      'Configures the reset/clear affordance (value, label, icon, tooltip, swatch color).',
    value: 'Controlled color value.',
    onChange: 'Called with the new color value when the selection changes.',
    presetColors: 'Preset color swatches shown in the picker as `{ label, value }[]`.',
    layout: {
      description: 'Controls how much of the picker UI is shown.',
      type: '"full" | "compact"',
    },
    sections:
      "Which picker sections render: any of 'swatch', 'picker', 'format-select', 'input'.",
    contentProps: 'Props forwarded to the picker content popover wrapper.',
    onValueChange: {
      description:
        'Low-level Radix callback fired with the raw color value as it changes.',
      type: '(value: string) => void',
    },
    format: {
      description: 'Controlled color format.',
      type: '"hex" | "rgb" | "hsl" | "hsb"',
    },
    defaultFormat: {
      description: 'Uncontrolled initial color format.',
      type: '"hex" | "rgb" | "hsl" | "hsb"',
    },
    onFormatChange: {
      description: 'Called when the selected color format changes.',
      type: '(format: string) => void',
    },
    name: 'Form field name submitted with the color value for native form integration.',
    asChild: {
      description:
        'Merge behavior and styles onto the child element instead of the default wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
    disabled: {
      description: 'Disables the color picker.',
      type: 'boolean',
      defaultValue: 'false',
    },
    inline: {
      description: 'Renders the picker inline instead of inside a popover.',
      type: 'boolean',
      defaultValue: 'false',
    },
    readOnly: {
      description: 'Makes the color value read-only.',
      type: 'boolean',
      defaultValue: 'false',
    },
    required: {
      description: 'Marks the field as required for form submission.',
      type: 'boolean',
      defaultValue: 'false',
    },
    open: {
      description: 'Controlled open state of the picker popover.',
      type: 'boolean',
    },
    defaultOpen: {
      description: 'Uncontrolled initial open state of the picker popover.',
      type: 'boolean',
    },
    onOpenChange: {
      description: 'Called when the picker popover opens or closes.',
      type: '(open: boolean) => void',
    },
    modal: {
      description:
        'Whether the picker popover traps focus and blocks outside interaction.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Input color picker',
      code: '<ColorPicker value={color} onChange={setColor} />',
    },
    {
      title: 'Button variant with presets',
      code: '<ColorPicker variant="button" value={color} onChange={setColor} presetColors={[{ label: "Red", value: "#ef4444" }]} />',
    },
  ],
  related: ['ColorPickerBase', 'ColorSelect'],
  keywords: ['color', 'picker', 'swatch', 'form', 'input'],
};
