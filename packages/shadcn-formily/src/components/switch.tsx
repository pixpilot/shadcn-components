import { connect, mapProps } from '@formily/react';
import { Switch as ShadcnSwitch } from '@internal/shadcn';

/**
 * Formily-connected Switch component
 * Toggle switch for boolean values
 */
export const Switch = connect(
  ShadcnSwitch,
  mapProps({
    value: 'checked',
    onInput: 'onCheckedChange',
  }),
);
