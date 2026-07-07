import type { IconToggleProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { IconToggle as ShadcnIconToggle } from '@pixpilot/shadcn-ui';

import { setCheckboxDefaultDecoratorProps } from '../../utils/formily-decorator';

export type { IconToggleProps } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected IconToggle component
 * Toggle button with customizable icons for boolean values
 */
export const IconToggle: FC<IconToggleProps> = connect(
  ShadcnIconToggle,
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
