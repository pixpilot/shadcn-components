import type { FileUploadProps as OrgFileUploadProps } from '@pixpilot/shadcn';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified: number;
}

export interface FileUploadCallbacks {
  onFileSuccess?: (fileMeta: FileMetadata) => void;
  onFileError?: (file: File, error: string) => void;
}

export type OnChangeSingleFile = (file: FileMetadata | null) => void;
export type OnChangeMultipleFiles = (files: FileMetadata[]) => void;

type MainFileUploadProps = Omit<OrgFileUploadProps, 'value' | 'onError'>;

export interface FileUploadBaseProps extends MainFileUploadProps {
  preventDuplicates?: boolean;
}

export type FileUploadProps =
  | ({
      multiple: true;
      value?: FileMetadata[];
      onChange?: OnChangeMultipleFiles;
    } & FileUploadBaseProps &
      FileUploadCallbacks)
  | ({
      multiple?: false; // defaults to single
      value?: FileMetadata | null;
      onChange?: OnChangeSingleFile;
    } & FileUploadBaseProps &
      FileUploadCallbacks);

export interface MultiFileUploadProps extends FileUploadBaseProps, FileUploadCallbacks {
  value?: FileMetadata[];
  onChange?: OnChangeMultipleFiles;
}

export interface SingleFileUploadProps
  extends Omit<FileUploadBaseProps, 'multiple'>, FileUploadCallbacks {
  value?: FileMetadata | null;
  onChange?: OnChangeSingleFile;
}

export interface FileUploadProgressCallBacks {
  onProgress: (file: File, progress: number) => void;
  onSuccess: (file: File) => void;
  onError: (file: File, error: Error) => void;
}

export interface FormFileUploadOptions extends FileUploadProgressCallBacks {
  component: string;
  componentProps: Record<string, any>;
}
