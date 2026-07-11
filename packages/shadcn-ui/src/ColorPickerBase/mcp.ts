import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ColorPickerBaseProps } from './types';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that a
// newly forwarded prop is a compile error until it is documented here. The props
// chain down to the Radix ColorPicker root, which extends the native `div`
// props, so subtract that native surface. `onChange` is a native `div` event
// name this component redefines, and `children` is a native `div` prop it
// documents as composition, so re-add both via the extra-props parameter.
type ColorPickerBaseDocumentedProps = DocumentedProps<
  ColorPickerBaseProps,
  'div',
  'onChange' | 'children'
>;

export const meta: ComponentMeta<ColorPickerBaseDocumentedProps> = {
  name: 'ColorPickerBase',
  category: 'Forms',
  description:
    'The headless color picker root that manages value and open state and exposes trigger/content composition through children (render-prop supported).',
  htmlElement: 'div',
  props: defineProps<ColorPickerBaseDocumentedProps>({
    value: 'Controlled color value.',
    onChange: 'Called with the new color value when the selection changes.',
    presetColors: 'Preset color swatches shown in the picker as `{ label, value }[]`.',
    layout: {
      description: 'Controls how much of the picker UI is shown.',
      type: '"full" | "compact"',
    },
    sections:
      "Which picker sections render: any of 'swatch', 'picker', 'format-select', 'input'.",
    contentProps: 'Props forwarded to the picker content wrapper (e.g. width).',
    children: {
      description:
        'Trigger/content composition. Accepts nodes or a render function receiving { value, onValueChange, isPickerOpen, id }.',
      type: 'React.ReactNode | ((props) => React.ReactNode)',
    },
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
      title: 'Composed trigger',
      code: '<ColorPickerBase value={color} onChange={setColor}>\n  <ColorPickerInput />\n</ColorPickerBase>',
    },
  ],
  related: ['ColorPicker'],
  keywords: ['color', 'picker', 'headless', 'form'],
};
