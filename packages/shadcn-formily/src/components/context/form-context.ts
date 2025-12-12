import type { FileUploadProgressCallBacks, IconProvider } from '@pixpilot/shadcn-ui';
import type { FormSpace } from '../../types';
import React from 'react';

export interface FomFileUpload {
  onUpload?: (files: File[], options: FileUploadProgressCallBacks) => void;
  maxSize?: number;
}

export interface FormContextStates extends FormSpace {
  itemProps?: {
    className?: string;
  };
  objectContainerProps?: {
    className?: string;
  };
  config?: {
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
    fileUpload?: FomFileUpload;
  };
}

export type FormContextStatesRequired = {
  [K in keyof FormContextStates]-?: FormContextStates[K];
};

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);
