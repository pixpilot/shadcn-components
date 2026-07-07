import type { Field } from '@formily/core';
import type { InputProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { Input as ShadcnInput } from '@pixpilot/shadcn-ui';

export type { InputProps } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected Input component
 * Automatically connects shadcn Input to Formily field state
 */
export const Input: FC<InputProps> = connect(
  ShadcnInput,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
    };
  }),
);
