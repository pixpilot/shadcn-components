import { connect, mapProps } from '@formily/react';
import { IconToggle as ShadcnIconToggle } from '@pixpilot/shadcn-ui';

import { setCheckboxDefaultDecoratorProps } from '../utils/formily-decorator';

/**
 * Formily-connected IconToggle component
 * Toggle button with customizable icons for boolean values
 */
export const IconToggle = connect(
  ShadcnIconToggle,
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
