import { connect, mapProps } from '@formily/react';
import { Input } from '@pixpilot/shadcn';

import { mapNumberInputProps } from './number-input-map-props';

/**
 * Formily-connected Number Input component
 */
export const NumberInput = connect(Input, mapProps(mapNumberInputProps));
