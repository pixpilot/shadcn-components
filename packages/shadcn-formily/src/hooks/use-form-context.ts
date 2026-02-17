import type {
  FomFileUpload,
  FormContextStates,
  FormSettings,
} from '../components/context';
import { use } from 'react';
import { FormContext } from '../components/context';

export function useFormContext(): FormContextStates {
  return use<FormContextStates>(FormContext);
}

export function useFormFileUpload(): FomFileUpload | undefined {
  const { settings } = useFormContext();
  const fileUploadConfig = settings?.fileUpload;
  return fileUploadConfig;
}

export function useFormConfig(): FormSettings {
  const { settings } = useFormContext();
  return settings || {};
}
