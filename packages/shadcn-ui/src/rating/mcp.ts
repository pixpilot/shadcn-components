import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { RatingProps } from './Rating';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `RatingProps` is a compile error until it is documented here.
// `RatingProps` extends the native `div` props, so subtract that native surface.
// `defaultValue` and `color` are native attribute names that this component
// redefines (initial rating / icon color), so re-add them via the extra-props
// parameter.
type RatingDocumentedProps = DocumentedProps<
  RatingProps,
  'div',
  'defaultValue' | 'color'
>;

export const meta: ComponentMeta<RatingDocumentedProps> = {
  name: 'Rating',
  category: 'Forms',
  description:
    'An accessible star/circle rating input supporting controlled or uncontrolled value, hover preview, keyboard navigation, and a hidden form field.',
  htmlElement: 'div',
  props: defineProps<RatingDocumentedProps>({
    value: {
      description: 'Controlled rating value.',
      type: 'number',
    },
    defaultValue: {
      description: 'Initial value when uncontrolled.',
      type: 'number',
    },
    onValueChange: {
      description: 'Called with the new rating value when the selection changes.',
      type: '(value: number) => void',
    },
    max: {
      description: 'Number of rating items when `options` is not provided.',
      type: 'number',
      defaultValue: '5',
    },
    options:
      'Explicit rating items as `{ label, value }[]`; overrides `max` and provides accessible labels.',
    iconType: {
      description: 'Glyph used for each rating item.',
      type: '"star" | "circle"',
      defaultValue: '"star"',
    },
    size: {
      description: 'Icon size.',
      type: '"sm" | "default" | "lg" | "xl"',
      defaultValue: '"default"',
    },
    readOnly: {
      description: 'Renders the rating as non-interactive display only.',
      type: 'boolean',
      defaultValue: 'false',
    },
    disabled: {
      description: 'Disables interaction and dims the control.',
      type: 'boolean',
      defaultValue: 'false',
    },
    name: 'Name for the hidden input, so the value participates in native form submission.',
    required: 'Marks the hidden form input as required.',
    color: {
      description: 'Color theme applied to the filled icons.',
      type: '"default" | "primary" | "secondary" | "destructive" | "foreground" | "accent" | "muted" | "ring"',
      defaultValue: '"default"',
    },
  }),
  examples: [
    {
      title: 'Controlled rating',
      code: '<Rating value={rating} onValueChange={setRating} max={5} />',
    },
    {
      title: 'Read-only circles',
      code: '<Rating value={4} readOnly iconType="circle" color="primary" />',
    },
  ],
  keywords: ['rating', 'stars', 'review', 'score', 'form'],
};
