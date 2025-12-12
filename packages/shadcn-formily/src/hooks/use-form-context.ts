import type { FomFileUpload, FormContextStates } from '../components/context';
import { use } from 'react';
import { FormContext } from '../components/context';

export function useFormContext(): FormContextStates {
  return use<FormContextStates>(FormContext);
}

export function useFormFileUpload(): FomFileUpload | undefined {
  const { config } = useFormContext();
  const fileUploadConfig = config?.fileUpload;
  return fileUploadConfig;
}
