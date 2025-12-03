import type { Field } from '@formily/core';
import { connect, mapProps } from '@formily/react';
import { Textarea as ShadcnTextarea } from '@pixpilot/shadcn';

/**
 * Formily-connected Textarea component
 */
export const Textarea = connect(
  ShadcnTextarea,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
    };
  }),
);
