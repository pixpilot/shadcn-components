import type { FormLayoutOptions, FormSettings } from './types';
import React from 'react';

export interface FormContextStates {
  /** Layout configuration options */
  layout?: FormLayoutOptions;
  /** Form-level configuration settings */
  settings?: FormSettings;
}

export type FormContextStatesRequired = Required<FormContextStates>;

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);

const { Provider, Consumer } = FormContext;

export { Consumer as FormContextContextConsumer, Provider as FormContextContextProvider };
