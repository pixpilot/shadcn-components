import type { ComponentProps, FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { Switch as ShadcnSwitch } from '@pixpilot/shadcn';

import { setCheckboxDefaultDecoratorProps } from '../../utils/formily-decorator';

export type SwitchProps = ComponentProps<typeof ShadcnSwitch>;

/**
 * Formily-connected Switch component
 * Toggle switch for boolean values
 */
export const Switch: FC<SwitchProps> = connect(
  ShadcnSwitch,
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
