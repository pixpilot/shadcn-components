import type { ArrayComponents } from './components/use-array-components-registry';
import { useFieldSchema } from '@formily/react';
import React from 'react';
import { useArrayComponentRegistry } from './components/use-array-components-registry';

export interface arrayComponentContextStates {}

const arrayComponentContext = React.createContext<ArrayComponents>({} as ArrayComponents);
const { Provider, Consumer } = arrayComponentContext;

export function useArrayComponents() {
  return React.use(arrayComponentContext);
}

export interface ComponentContextProps {
  children?: React.ReactNode;
}

export const ArrayComponentProvider: React.FC<ComponentContextProps> = (props) => {
  const { children } = props;
  const schema = useFieldSchema();

  const components = useArrayComponentRegistry(schema);

  return <Provider value={components}>{children}</Provider>;
};

ArrayComponentProvider.displayName = 'ArrayComponentProvider';

export {
  Consumer as ArrayComponentContextConsumer,
  Provider as ArrayComponentContextProvider,
};
