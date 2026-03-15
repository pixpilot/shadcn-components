import { connect, mapProps } from '@formily/react';
import { ToggleButton as ShadcnToggleButton } from '@pixpilot/shadcn-ui';

import { setCheckboxDefaultDecoratorProps } from '../utils/formily-decorator';

/**
 * Formily-connected IconToggle component
 * Toggle button with customizable icons for boolean values
 */
export const ToggleButton = connect(
  ShadcnToggleButton,
  mapProps(
    {
      value: 'checked',
      onInput: 'onChange',
    },
    (props, field) => {
      setCheckboxDefaultDecoratorProps(field);

      return props;
    },
  ),
);
