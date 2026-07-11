import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { ComboboxProps } from './Combobox';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that a
// newly added prop is a compile error until it is documented here. `id`,
// `value`, and `onChange` are native attribute names the component redefines,
// so re-add them via the extra-props parameter.
type ComboboxDocumentedProps = DocumentedProps<
  ComboboxProps,
  'button',
  'id' | 'value' | 'onChange'
>;

export const meta: ComponentMeta<ComboboxDocumentedProps> = {
  name: 'Combobox',
  category: 'Forms',
  htmlElement: 'button',
  description:
    'A searchable single-select rendered as a popover with a command list, letting users filter options by typing.',
  props: defineProps<ComboboxDocumentedProps>({
    value: 'Controlled selected option value.',
    onChange: 'Called with the selected value when an option is chosen.',
    options: 'Selectable options as `{ label, value }[]` (CommandOptionListItem).',
    placeholder: {
      description: 'Text shown on the trigger before a value is selected.',
      type: 'string',
      defaultValue: '"Select option..."',
    },
    searchPlaceholder: {
      description: 'Placeholder for the search input inside the popover.',
      type: 'string',
      defaultValue: '"Search..."',
    },
    emptyText: {
      description: 'Message shown when no option matches the search query.',
      type: 'string',
      defaultValue: '"No option found."',
    },
    id: 'Optional id attribute applied to the trigger element.',
    variant: {
      description: 'Controls the visual treatment of the trigger button.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"outline"',
    },
    size: {
      description: 'Controls the trigger button dimensions and icon-only sizing.',
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
    asChild: {
      description:
        'Render the trigger button behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
    commandProps: {
      description:
        'Props forwarded to the underlying cmdk `Command` root, e.g. `filter`, `shouldFilter`, `loop`, `vimBindings`.',
      type: 'ComponentProps<typeof Command>',
    },
  }),
  examples: [
    {
      title: 'Searchable select',
      code: '<Combobox value={value} onChange={setValue} options={[{ label: "Next.js", value: "next" }, { label: "Remix", value: "remix" }]} />',
    },
  ],
  related: ['Select', 'ColorSelect'],
  keywords: ['combobox', 'select', 'search', 'autocomplete', 'form'],
};
