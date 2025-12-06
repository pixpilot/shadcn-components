import type { FormContextStates } from '../components/context';
import { use } from 'react';
import { FormContext } from '../components/context';

export function useFormContext(): FormContextStates {
  return use<FormContextStates>(FormContext);
}
