import type { FileUploadProps } from '../file-upload/types';

export interface FileUploadInlineBaseProps {
  /**
   * Button text when no file is selected
   */
  buttonText?: string;
  /**
   * Show file icon
   */
  showIcon?: boolean;
}

export type FileUploadInlineProps = FileUploadInlineBaseProps & FileUploadProps;
