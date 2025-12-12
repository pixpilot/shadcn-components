import type { FileUploadProps as OrgFileUploadProps } from '@pixpilot/shadcn';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified: number;
}

export type OnChangeSingleFile = (file: FileMetadata | null) => void;
export type OnChangeMultipleFiles = (files: FileMetadata[]) => void;

export interface FileUploadBaseProps extends Omit<OrgFileUploadProps, 'value'> {}

export type FileUploadProps =
  | ({
      multiple: true;
      value?: FileMetadata[];
      onChange?: OnChangeMultipleFiles;
    } & Omit<OrgFileUploadProps, 'value'>)
  | ({
      multiple?: false; // defaults to single
      value?: FileMetadata | null;
      onChange?: OnChangeSingleFile;
    } & Omit<OrgFileUploadProps, 'value'>);

export interface MultiFileUploadProps extends FileUploadBaseProps {
  value?: FileMetadata[];
  onChange?: OnChangeMultipleFiles;
}

export interface SingleFileUploadProps extends Omit<FileUploadBaseProps, 'multiple'> {
  value?: FileMetadata | null;
  onChange?: (files: FileMetadata) => void;
}

export interface FileUploadProgressCallBacks {
  onProgress: (file: File, progress: number) => void;
  onSuccess: (file: File) => void;
  onError: (file: File, error: Error) => void;
}
