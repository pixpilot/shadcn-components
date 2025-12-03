import { connect, mapProps } from '@formily/react';
import { Checkbox as ShadcnCheckbox } from '@pixpilot/shadcn';

/**
 * Formily-connected Checkbox component
 * Maps Formily field checked state to shadcn Checkbox
 */
export const Checkbox = connect(
  ShadcnCheckbox,
  mapProps({
    value: 'checked',
    onInput: 'onCheckedChange',
  }),
);
