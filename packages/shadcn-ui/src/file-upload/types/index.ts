import type { FileUploadProps as OrgFileUploadProps } from '@pixpilot/shadcn';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FileUploadBaseProps extends Omit<OrgFileUploadProps, 'value'> {}

export type FileUploadProps =
  | ({
      multiple: true;
      value?: FileMetadata[];
      onChange?: (files: FileMetadata[]) => void;
    } & Omit<OrgFileUploadProps, 'value'>)
  | ({
      multiple?: false; // defaults to single
      value?: FileMetadata;
      onChange?: (file: FileMetadata) => void;
    } & Omit<OrgFileUploadProps, 'value'>);

export interface MultiFileUploadProps extends FileUploadBaseProps {
  value?: FileMetadata[];
  onChange?: (files: FileMetadata[]) => void;
}

export interface SingleFileUploadProps extends FileUploadBaseProps {
  value?: FileMetadata;
  onChange?: (files: FileMetadata) => void;
}

export interface FileUploadProgressCallBacks {
  onProgress: (file: File, progress: number) => void;
  onSuccess: (file: File) => void;
  onError: (file: File, error: Error) => void;
}
