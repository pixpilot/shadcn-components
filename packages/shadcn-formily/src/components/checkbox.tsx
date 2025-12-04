import { connect, mapProps } from '@formily/react';
import { Checkbox as ShadcnCheckbox } from '@pixpilot/shadcn';

/**
 * Formily-connected Checkbox component
 * Maps Formily field checked state to shadcn Checkbox
 */
export const Checkbox = connect(
  ShadcnCheckbox,
  mapProps(
    {
      value: 'checked',
      onInput: 'onCheckedChange',
    },
    (props, field) => {
      // eslint-disable-next-line no-param-reassign
      field.decoratorProps.labelPlacement = 'end';

      return {
        ...props,
      };
    },
  ),
);

/**
 * Default label placement for checkbox
 * Used by FormItem to determine label positioning
 */
(Checkbox as typeof Checkbox & { labelPlacement?: string }).labelPlacement = 'right';
