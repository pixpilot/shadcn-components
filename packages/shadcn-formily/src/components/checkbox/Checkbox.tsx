import type { ComponentProps, FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { Checkbox as ShadcnCheckbox } from '@pixpilot/shadcn';

import { setCheckboxDefaultDecoratorProps } from '../../utils/formily-decorator';

export type CheckboxProps = ComponentProps<typeof ShadcnCheckbox>;

/**
 * Formily-connected Checkbox component
 * Maps Formily field checked state to shadcn Checkbox
 */
export const Checkbox: FC<CheckboxProps> = connect(
  ShadcnCheckbox,
  mapProps(
    {
      value: 'checked',
      onInput: 'onCheckedChange',
    },
    (props, field) => {
      setCheckboxDefaultDecoratorProps(field);

      return props;
    },
  ),
);
