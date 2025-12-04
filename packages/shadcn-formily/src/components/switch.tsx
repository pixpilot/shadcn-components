import { connect, mapProps } from '@formily/react';
import { Switch as ShadcnSwitch } from '@pixpilot/shadcn';

/**
 * Formily-connected Switch component
 * Toggle switch for boolean values
 */
export const Switch = connect(
  ShadcnSwitch,
  mapProps(
    {
      value: 'checked',
      onInput: 'onCheckedChange',
    },
    (props, field) => {
      // eslint-disable-next-line no-param-reassign
      field.decoratorProps.labelPlacement = 'end';
      return props;
    },
  ),
);
