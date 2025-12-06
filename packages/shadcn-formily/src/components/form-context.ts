import type { FormSpace } from '../types/form';
import React from 'react';

export interface FormContextStates extends FormSpace {
  itemProps?: {
    className?: string;
  };
  objectContainerProps?: {
    className?: string;
  };
}

export type FormContextStatesRequired = {
  [K in keyof FormContextStates]-?: FormContextStates[K];
};

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);
