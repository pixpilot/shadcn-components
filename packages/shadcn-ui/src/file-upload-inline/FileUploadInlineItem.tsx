'use client';

import type { FileMetadata } from '../file-upload/types';
import type { FileWithMetadata } from '../file-upload/utils';
import {
  Button,
  cn,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemProgress,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import { useFileError, useFileUploadProgressCallbacks } from '../file-upload/hooks';

interface FileUploadInlineItemProps {
  file: File;
  disabled?: boolean;
  onChange?: (file: FileMetadata) => void;
}

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
  onClick?: () => void;
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
  file?: File;
  disabled?: boolean;
  onDelete?: (file: FileWithMetadata) => void;
}

export const FileItem: React.FC<FileItemProps> = React.memo(
  ({
    file,
    name = '',
    size = 0,
    type = '',
    lastModified = 0,
    disabled = false,
    onDelete,
  }) => {
    // Always call hooks at the top level, even if file is undefined
    useFileUploadProgressCallbacks(file || new File([], ''), { onChange: () => {} });
    const fileError = useFileError(file || new File([], ''));
    const isUploadingFile = Boolean(file);

    const content = (
      <FileItemWrapper>
        <FileItemInnerWrapper>
          <FileMetaDataDisplay
            name={name}
            size={size}
            lastModified={lastModified}
            type={type}
          >
            {fileError != null && isUploadingFile && (
              <div className="text-destructive text-xs">{fileError}</div>
            )}
          </FileMetaDataDisplay>
          {!disabled && (
            <>
              {isUploadingFile ? (
                <FileUploadItemDelete asChild>
                  <DeleteIconButton
                    onClick={() => {
                      if (onDelete) {
                        onDelete({ name, size, type, lastModified, file });
                      }
                    }}
                  />
                </FileUploadItemDelete>
              ) : (
                <DeleteIconButton
                  onClick={() => {
                    if (onDelete) {
                      onDelete({ name, size, type, lastModified, file });
                    }
                  }}
                />
              )}
            </>
          )}
        </FileItemInnerWrapper>
        {isUploadingFile && fileError == null && (
          <FileUploadItemProgress variant="linear" className="h-1 w-full" />
        )}
      </FileItemWrapper>
    );

    if (isUploadingFile && file) {
      return (
        <FileUploadItem
          key={`${name}-${size}-${lastModified}`}
          className="p-0 m-0 border-none"
          value={file}
        >
          {content}
        </FileUploadItem>
      );
    }

    return content;
  },
);

export function FileUploadInlineItem(props: FileUploadInlineItemProps) {
  const { file, disabled = false } = props;

  return (
    <FileItem
      file={file}
      name={file.name}
      size={file.size}
      type={file.type}
      lastModified={file.lastModified}
      disabled={disabled}
    />
  );
}
