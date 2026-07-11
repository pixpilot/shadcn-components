import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ToggleGroupProps } from './ToggleGroup';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the re-exported Radix ToggleGroup props so
// that a newly forwarded prop is a compile error until it is documented here.
// The Radix props extend the native `div` props, so subtract that native
// surface. `defaultValue` is a native attribute name Radix redefines as the
// uncontrolled selection, so re-add it via the extra-props parameter.
type ToggleGroupDocumentedProps = DocumentedProps<
  ToggleGroupProps,
  'div',
  'defaultValue'
>;

export const meta: ComponentMeta<ToggleGroupDocumentedProps> = {
  name: 'ToggleGroup',
  category: 'Actions',
  description:
    'A set of related toggle buttons that behave as a single- or multiple-selection group, composed with ToggleGroupItem.',
  props: defineProps<ToggleGroupDocumentedProps>({
    type: {
      description:
        'Whether one item ("single") or many items ("multiple") can be selected.',
      type: '"single" | "multiple"',
    },
    value: {
      description:
        'Controlled selection: a string for "single" type or a string[] for "multiple".',
      type: 'string | string[]',
    },
    defaultValue:
      'Uncontrolled initial selection (a string for "single" type, a string[] for "multiple").',
    onValueChange: 'Called with the new selection when it changes.',
    variant: {
      description: 'Visual treatment applied to the items.',
      type: '"default" | "outline"',
    },
    size: {
      description: 'Size applied to the items.',
      type: '"default" | "sm" | "lg"',
    },
    spacing: {
      description: 'Spacing applied between items in the group.',
      type: '"default" | "sm" | "lg"',
    },
    disabled: 'Disables the entire group.',
    orientation: {
      description: 'Layout and arrow-key navigation orientation of the group.',
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
    rovingFocus: {
      description:
        'When false, disables roving-focus arrow-key navigation between items.',
      type: 'boolean',
      defaultValue: 'true',
    },
    loop: {
      description:
        'When true, keyboard navigation wraps around from the last item to the first.',
      type: 'boolean',
      defaultValue: 'true',
    },
    asChild: {
      description:
        'Merge behavior and styles onto the child element instead of the default wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Single-select group',
      code: '<ToggleGroup type="single" value={align} onValueChange={setAlign}>\n  <ToggleGroupItem value="left">Left</ToggleGroupItem>\n  <ToggleGroupItem value="center">Center</ToggleGroupItem>\n  <ToggleGroupItem value="right">Right</ToggleGroupItem>\n</ToggleGroup>',
    },
  ],
  related: ['ToggleButton', 'IconToggle'],
  keywords: ['toggle', 'group', 'segmented', 'selection'],
};
