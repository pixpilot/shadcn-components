import type { FileUploadProps } from '@/components';

export interface FileUploadInlineProps extends Omit<FileUploadProps, 'value'> {
  /**
   * The current file value (single file or array)
   */
  value?: File | File[] | null;
  /**
   * Callback when file changes
   */
  onChange?: (file: File | File[] | null) => void;
  /**
   * Button text when no file is selected
   */
  buttonText?: string;
  /**
   * Show file icon
   */
  showIcon?: boolean;
  /**
   * Whether to show a clear button when a file is selected
   */
  showClear?: boolean;
}
