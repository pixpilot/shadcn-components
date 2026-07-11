import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ToggleButtonProps } from './ToggleButton';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `ToggleButtonProps` is a compile error until it is documented
// here. `ToggleButtonProps` extends the native `button` props, so subtract that
// native surface. `onChange` and `defaultChecked` are native attribute names
// this component redefines for the checked state, so re-add them via the
// extra-props parameter.
type ToggleButtonDocumentedProps = DocumentedProps<
  ToggleButtonProps,
  'button',
  'onChange' | 'defaultChecked'
>;

export const meta: ComponentMeta<ToggleButtonDocumentedProps> = {
  name: 'ToggleButton',
  category: 'Actions',
  description:
    'A button with an on/off state that swaps its content (and optionally its props) between checked and unchecked. Supports controlled and uncontrolled use.',
  htmlElement: 'button',
  props: defineProps<ToggleButtonDocumentedProps>({
    checked: {
      description: 'Controlled checked state.',
      type: 'boolean',
    },
    defaultChecked: {
      description: 'Initial checked state when uncontrolled.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onChange: {
      description: 'Called with the next checked state when toggled.',
      type: '(checked: boolean) => void',
    },
    checkedContent: 'Content rendered while checked.',
    uncheckedContent: 'Content rendered while unchecked.',
    checkedProps: 'Button props applied while checked (e.g. a different variant).',
    uncheckedProps: 'Button props applied while unchecked.',
    variant: {
      description: 'Visual button treatment inherited from the base button.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"outline"',
    },
    asChild: {
      description:
        'Render behavior through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
    size: {
      description: 'Controls the button dimensions, inherited from the base button.',
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
  }),
  examples: [
    {
      title: 'Mute toggle',
      code: '<ToggleButton checked={muted} onChange={setMuted} checkedContent="Muted" uncheckedContent="Mute" />',
    },
  ],
  related: ['IconToggle', 'ToggleGroup'],
  keywords: ['toggle', 'button', 'switch', 'on', 'off'],
};
