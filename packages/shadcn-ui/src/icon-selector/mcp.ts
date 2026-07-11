import type { ComponentMeta } from '@internal/mcp';
import type { IconPickerProps } from './IconPicker';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `IconPickerProps` is a compile error until it is documented
// here.
type IconPickerDocumentedProps = Extract<keyof IconPickerProps, string>;

export const meta: ComponentMeta<IconPickerDocumentedProps> = {
  name: 'IconPicker',
  category: 'Forms',
  description:
    'An icon selector that lets users browse and pick icons from one or more Iconify providers, shown in a dialog or popover with search and a virtualized grid.',
  props: defineProps<IconPickerDocumentedProps>({
    id: 'Optional id attribute applied to the picker trigger element.',
    value: 'Controlled selected icon name (e.g. "mdi:home").',
    onChange: 'Called with the selected icon name, or "" when cleared.',
    providers:
      'Icon providers to browse. Each is an IconProviderProps object or an async loader.',
    pickerMode: {
      description: 'How the picker is shown (popover falls back to dialog on mobile).',
      type: '"dialog" | "popover"',
      defaultValue: '"dialog"',
    },
    variant: {
      description: 'Trigger presentation.',
      type: '"default" | "icon-button"',
      defaultValue: '"default"',
    },
    onOpenChange: 'Called when the picker opens or closes.',
    popoverProps: 'Props forwarded to the popover content when in popover mode.',
    isLoading: 'Marks the providers as still loading.',
    onProvidersLoaded: 'Called with `{ prefix, name }[]` once async providers resolve.',
    showValueText: {
      description: 'Shows the selected icon name next to the preview.',
      type: 'boolean',
      defaultValue: 'true',
    },
    emptyText: 'Content shown in the preview when no icon is selected.',
    showClearButton: {
      description: 'Shows a clear button when an icon is selected.',
      type: 'boolean',
      defaultValue: 'true',
    },
    slots:
      'Class overrides for the root, preview, trigger, clear button, and value text.',
    className: 'Class overrides for the root element.',
  }),
  dependencies: [{ name: '@iconify/react', type: 'peer', notes: 'Renders the icons.' }],
  examples: [
    {
      title: 'Icon picker',
      code: '<IconPicker value={icon} onChange={setIcon} providers={[mdiProvider]} />',
    },
  ],
  keywords: ['icon', 'picker', 'selector', 'iconify', 'form'],
};
