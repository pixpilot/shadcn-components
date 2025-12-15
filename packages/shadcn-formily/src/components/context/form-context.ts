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
    className?: string;
  };
  objectContainerProps?: {
    className?: string;
  };
  config?: FormConfigProps;
}

export type FormContextStatesRequired = {
  [K in keyof FormContextStates]-?: FormContextStates[K];
};

export const FormContext = React.createContext<FormContextStates>(
  {} as FormContextStates,
);
