import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { SelectProps } from './Select';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that a
// newly added prop is a compile error until it is documented here. `SelectProps`
// extends the trigger's (button) props, so native attributes are stripped; the
// native names the component redefines are re-added via the extra-props
// parameter.
type SelectDocumentedProps = DocumentedProps<
  SelectProps,
  'button',
  'id' | 'value' | 'onChange' | 'name' | 'disabled' | 'className'
>;

export const meta: ComponentMeta<SelectDocumentedProps> = {
  name: 'Select',
  category: 'Forms',
  htmlElement: 'button',
  description:
    'A single-select dropdown driven by an options array, with configurable keyboard navigation, dropdown positioning, and an optional clear button.',
  props: defineProps<SelectDocumentedProps>({
    options:
      'Selectable options as `{ label, value }[]` where value is a string or number.',
    value: 'Controlled selected value (compared as a string).',
    onChange:
      'Called with the selected value when it changes; called with "" when cleared.',
    placeholder: 'Placeholder text shown before a value is selected.',
    contentProps: 'Props forwarded to the underlying select content popover.',
    keyboardMode: {
      description:
        'How arrow keys behave: "dropdown" opens the menu, "cycle" steps through options in place.',
      type: '"cycle" | "dropdown"',
      defaultValue: '"dropdown"',
    },
    position: {
      description: 'Dropdown positioning strategy.',
      type: '"item-aligned" | "popper"',
    },
    clearable: {
      description: 'Shows a clear button when a value is selected.',
      type: 'boolean',
      defaultValue: 'false',
    },
    disabled: 'Disables the select trigger.',
    name: 'Name used when the select participates in native form submission.',
    required: 'Marks the select as required.',
    id: 'Optional id attribute applied to the select trigger.',
    className: 'Additional CSS class applied to the select trigger.',
    open: {
      description: 'Controlled open state of the dropdown.',
      type: 'boolean',
    },
    onOpenChange: {
      description: 'Called when the dropdown opens or closes.',
      type: '(open: boolean) => void',
    },
    size: {
      description: 'Controls the trigger height.',
      type: '"sm" | "default"',
      defaultValue: '"default"',
    },
    asChild: {
      description:
        'Render the trigger behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Basic select',
      code: '<Select value={value} onChange={setValue} options={[{ label: "One", value: "1" }, { label: "Two", value: "2" }]} placeholder="Choose…" />',
    },
    {
      title: 'Clearable select',
      code: '<Select value={value} onChange={setValue} options={options} clearable />',
    },
  ],
  related: ['Combobox', 'ColorSelect'],
  keywords: ['select', 'dropdown', 'options', 'form'],
};
