'use client';

import type { FileMetadata } from '../file-upload/types';
import type { FileWithMetadata } from '../file-upload/utils';
import {
  Button,
  cn,
  FileUploadItem,
  FileUploadItemProgress,
  useFileUpload,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import { useFileError, useFileUploadProgressCallbacks } from '../file-upload/hooks';

const FileMetaDataDisplay: React.FC<
  FileMetadata & {
    children?: React.ReactNode;
  }
> = ({ size, name, children }) => {
  return (
    <div className={cn('min-w-0 flex-1 flex flex-col')}>
      <span className={cn('truncate font-medium text-sm')}>{name}</span>
      <span className={cn('truncate text-muted-foreground text-xs')}>
        {prettyBytes(size)}
      </span>
      {children}
    </div>
  );
};

const DeleteIconButton: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 shrink-0"
      aria-label="Remove file"
      onClick={onClick}
    >
      <XIcon className="h-3.5 w-3.5" />
    </Button>
  );
};

const FileItemWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-input bg-background px-3 py-2 m-0 w-full">
      {children}
    </div>
  );
};

const FileItemInnerWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="flex w-full gap-2">{children}</div>;
};

interface FileItemProps extends Partial<FileMetadata> {
  file: File;
  disabled?: boolean;
  onDelete: (file: FileWithMetadata) => void;
}

export const FileUploadInlineItem: React.FC<FileItemProps> = React.memo(
  ({
    file,
    name = '',
    size = 0,
    type = '',
    lastModified = 0,
    disabled = false,
    onDelete,
  }) => {
    useFileUploadProgressCallbacks(file, { onChange: () => {} });
    const fileError = useFileError(file);

    const isUploading = useFileUpload((store) => {
      const storeFile = store.files.get(file);
      return storeFile?.status === 'uploading';
    });

    const content = (
      <FileItemWrapper>
        <FileItemInnerWrapper>
          <FileMetaDataDisplay
            name={name}
            size={size}
            lastModified={lastModified}
            type={type}
          >
            {fileError != null && isUploading && (
              <div className="text-destructive text-xs">{fileError}</div>
            )}
          </FileMetaDataDisplay>
          {!disabled && (
            <DeleteIconButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete({ name, size, type, lastModified, file });
              }}
            />
          )}
        </FileItemInnerWrapper>
        {isUploading && fileError == null && (
          <FileUploadItemProgress variant="linear" className="h-1 w-full" />
        )}
      </FileItemWrapper>
    );

    return (
      <FileUploadItem
        key={`${name}-${size}-${lastModified}`}
        className="p-0 m-0 border-none"
        value={file}
      >
        {content}
      </FileUploadItem>
    );
  },
);
