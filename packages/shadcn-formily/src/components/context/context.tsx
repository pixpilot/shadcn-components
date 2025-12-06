import { FormContext } from './form-context';

export type { FormContextStates, FormContextStatesRequired } from './form-context';

const { Provider, Consumer } = FormContext;

export {
  FormContext,
  Consumer as FormContextContextConsumer,
  Provider as FormContextContextProvider,
};
