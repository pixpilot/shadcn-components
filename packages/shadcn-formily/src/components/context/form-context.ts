import type {
  FileUploadProgressCallBacks,
  IconProvider,
  RichTextEditorProps,
} from '@pixpilot/shadcn-ui';
import type { FormSpace } from '../../types';
import React from 'react';

export interface FomFileUpload {
  onUpload?: (files: File[], options: FileUploadProgressCallBacks) => void;
  maxSize?: number;
}

export interface FormConfigProps {
  label?: {
    // Whether to use field name as label if title is not provided
    useFieldNameAsLabel?: boolean;
  };
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
  richTextEditor?: RichTextEditorProps;
}

export interface FormContextStates extends FormSpace {
  itemProps?: {
    classes?: {
      label?: string;
      description?: string;
      inputWrapper?: string;
      errorMessage?: string;
    };
  };
  objectContainer?: {
    classes?: {
      card?: string;
      header?: string;
      title?: string;
      description?: string;
      content?: string;
    };
  };
  settings?: FormConfigProps;
}

export type FormContextStatesRequired = {
  [K in keyof FormContextStates]-?: FormContextStates[K];
};

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);
