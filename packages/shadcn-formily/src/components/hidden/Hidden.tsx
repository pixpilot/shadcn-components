import type { Field } from '@formily/core';
import { connect, mapProps } from '@formily/react';

export interface HiddenProps {
  children?: React.ReactNode;
  value?: string;
}

const HiddenInput: React.FC<HiddenProps> = (props) => {
  return <input type="hidden" value={props.value} />;
};

/**
 * Formily-connected Input component
 * Automatically connects shadcn Input to Formily field state
 */
export const Hidden = connect(
  HiddenInput,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
    };
  }),
);
