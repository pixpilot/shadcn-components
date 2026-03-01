import type { ComponentProps, ReactNode } from 'react';
import type { FileUploadProps } from '../file-upload/types';
import type { FileUploadRootItemProps } from './FileUploadRootItem';

export interface FileUploadRootPropsBaseProps {
  /**
   * Optional custom trigger children
   */
  children?: ReactNode;

  slots?: {
    /** Props spread onto the `FileUploadTrigger` (renders a `button`) */
    trigger?: Omit<ComponentProps<'button'>, 'children'> & { asChild?: boolean };
    /** Props spread onto the `FileUploadDropzone` (renders a `div`) */
    dropzone?: ComponentProps<'div'> & { asChild?: boolean };
    /** Props passed to the file item component */
    fileItem?: Partial<FileUploadRootItemProps>;
  };
}

export type FileUploadRootProps = FileUploadRootPropsBaseProps & FileUploadProps;
