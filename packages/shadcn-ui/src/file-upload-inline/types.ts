import type { FileUploadRootProps } from '../file-upload-root';

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

export type FileUploadInlineProps = FileUploadInlineBaseProps & FileUploadRootProps;
