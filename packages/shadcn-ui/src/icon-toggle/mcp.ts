import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { IconToggleProps } from './IconToggle';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `IconToggleProps` is a compile error until it is documented
// here. `IconToggleProps` extends the native `button` props, so subtract that
// native surface. `onChange` and `defaultChecked` are native attribute names
// this component redefines for the checked state, so re-add them via the
// extra-props parameter.
type IconToggleDocumentedProps = DocumentedProps<
  IconToggleProps,
  'button',
  'onChange' | 'defaultChecked'
>;

export const meta: ComponentMeta<IconToggleDocumentedProps> = {
  name: 'IconToggle',
  category: 'Actions',
  description:
    'A square toggle button that swaps between two icons for its checked and unchecked states. Icons may be React nodes or raw SVG markup strings.',
  htmlElement: 'button',
  props: defineProps<IconToggleDocumentedProps>({
    checkedIcon: {
      description:
        'Icon shown when checked. Accepts a React node or an SVG markup string.',
      type: 'React.ReactNode | string',
    },
    uncheckedIcon: {
      description:
        'Icon shown when unchecked. Accepts a React node or an SVG markup string.',
      type: 'React.ReactNode | string',
    },
    size: {
      description: 'Controls the button and icon dimensions.',
      type: '"sm" | "default" | "lg"',
      defaultValue: '"default"',
    },
    checked: {
      description: 'Controlled checked state.',
      type: 'boolean',
    },
    defaultChecked: {
      description: 'Initial checked state when uncontrolled.',
      type: 'boolean',
    },
    onChange: {
      description: 'Called with the next checked state when toggled.',
      type: '(checked: boolean) => void',
    },
    variant: {
      description: 'Visual button treatment inherited from the base button.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"outline"',
    },
    asChild: {
      description:
        'Render behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
    checkedProps: 'Extra props merged onto the button while it is in the checked state.',
    uncheckedProps:
      'Extra props merged onto the button while it is in the unchecked state.',
  }),
  examples: [
    {
      title: 'Favorite toggle',
      code: '<IconToggle checked={fav} onChange={setFav} checkedIcon={<HeartFilled />} uncheckedIcon={<Heart />} />',
    },
  ],
  related: ['ToggleButton'],
  keywords: ['toggle', 'icon', 'button', 'switch'],
};
