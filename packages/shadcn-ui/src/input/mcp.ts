import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { InputProps } from './Input';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `InputProps` is a compile error until it is documented here.
// `InputProps` extends the native `input` props, so subtract that native
// surface. `prefix` and `suffix` are global HTML attribute names that this
// component redefines as addon nodes, so re-add them via the extra-props
// parameter.
type InputDocumentedProps = DocumentedProps<InputProps, 'input', 'prefix' | 'suffix'>;

export const meta: ComponentMeta<InputDocumentedProps> = {
  name: 'Input',
  category: 'Forms',
  description:
    'A text input that renders as a plain shadcn input, or as an input group with prefix/suffix addons when either is provided.',
  htmlElement: 'input',
  props: defineProps<InputDocumentedProps>({
    prefix: 'Content rendered as an addon before the input (e.g. an icon or "$").',
    suffix: 'Content rendered as an addon after the input (e.g. a unit or button).',
    groupClassName:
      'Class applied to the input group wrapper when prefix/suffix is used.',
    prefixClassName: 'Class applied to the prefix addon element.',
    suffixClassName: 'Class applied to the suffix addon element.',
  }),
  examples: [
    {
      title: 'Plain input',
      code: '<Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />',
    },
    {
      title: 'Input with addons',
      code: '<Input prefix="$" suffix="USD" placeholder="0.00" />',
    },
  ],
  keywords: ['input', 'text', 'field', 'form', 'addon'],
};
