import { connect, mapProps, useFieldSchema } from '@formily/react';
import { Input } from '@pixpilot/shadcn';

/**
 * Formily-connected Number Input component
 */
export const NumberInput = connect(
  Input,
  mapProps((props) => {
    const schema = useFieldSchema();
    const min = schema?.minimum;
    const max = schema?.maximum;
    return { min, max, ...props, type: 'number' };
  }),
);
