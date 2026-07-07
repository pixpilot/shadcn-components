import type { InputProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { Input } from '@pixpilot/shadcn-ui';

import { mapNumberInputProps } from './number-input-map-props';

export type NumberInputProps = InputProps;

/**
 * Formily-connected Number Input component
 */
export const NumberInput: FC<NumberInputProps> = connect(
  Input,
  mapProps(mapNumberInputProps),
);
