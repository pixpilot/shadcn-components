import { connect, mapProps } from '@formily/react';
import { Input } from '@pixpilot/shadcn';

/**
 * Formily-connected Number Input component
 */
export const NumberInput = connect(
  Input,
  mapProps((props) => {
    return {
      ...props,
      type: 'number',
    };
  }),
);
