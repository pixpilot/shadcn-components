import type { IconProvider } from '@pixpilot/shadcn-ui';
import type { FormSpace } from '../../types';
import React from 'react';

export interface FormContextStates extends FormSpace {
  itemProps?: {
    className?: string;
  };
  objectContainerProps?: {
    className?: string;
  };
  fields?: {
    iconPicker?: {
      /**
       * Icon providers - can be static providers or async loader functions
       * Users can provide either IconProvider[] or AsyncIconProvider[]
       */
      providers: IconProvider[];
      /**
       * Optional callback when providers are loaded
       */
      onProvidersLoaded?: (providers: IconProvider[]) => void;
    };
  };
}

export type FormContextStatesRequired = {
  [K in keyof FormContextStates]-?: FormContextStates[K];
};

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);
