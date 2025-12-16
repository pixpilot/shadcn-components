import { FormContext } from './form-context';

export type {
  FormContextStates,
  FormContextStatesRequired,
  FormLayoutOptions,
} from './form-context';

const { Provider, Consumer } = FormContext;

export {
  FormContext,
  Consumer as FormContextContextConsumer,
  Provider as FormContextContextProvider,
};
