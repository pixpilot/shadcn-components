'use client';

import type { FileUploadCallbacks } from './types';
import type { FileWithMetadata } from './utils';
import { cn, FileUploadList } from '@pixpilot/shadcn';
import { Plus } from 'lucide-react';
import { FileUploadListItem } from './FileUploadListItem';

interface FileUploadItemsProps extends FileUploadCallbacks {
  displayFiles: FileWithMetadata[];
  deleteFile: (fileMeta: FileWithMetadata) => void;
  getFile: (fileMeta: FileWithMetadata) => File;
  maxFiles?: number;
  itemSize: string;
  className?: string;
}

export function FileUploadItems({
  displayFiles,
  deleteFile,
  getFile,
  maxFiles,
  itemSize,
  onFileSuccess,
  onFileError,
  className,
}: FileUploadItemsProps) {
  return (
    <FileUploadList
      orientation="horizontal"
      forceMount
      className={cn('flex-wrap gap-4 w-full ', className)}
    >
      {displayFiles.map((fileMeta: FileWithMetadata) => {
        const { name, lastModified } = fileMeta;
        const key = `${name}-${lastModified}`;

        return (
          <FileUploadListItem
            key={key}
            fileMeta={fileMeta}
            deleteFile={deleteFile}
            getFile={getFile}
            itemSize={itemSize}
            onFileSuccess={onFileSuccess}
            onFileError={onFileError}
          />
        );
      })}
      {maxFiles === undefined || displayFiles.length < maxFiles ? (
        <div
          className={cn(
            itemSize,
            'flex items-center justify-center  border-2 border-dashed rounded-md',
          )}
        >
          <Plus className="size-6 text-muted-foreground" />
        </div>
      ) : null}
    </FileUploadList>
  );
}
