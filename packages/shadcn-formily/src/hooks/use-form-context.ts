import type { FormContextStates } from '../components/form-context';
import { use } from 'react';
import { FormContext } from '../components/form-context';

export function useFormContext(): FormContextStates {
  return use<FormContextStates>(FormContext);
}
