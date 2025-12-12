'use client';

import type { FileWithMetadata } from './utils';
import {
  cn,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
} from '@pixpilot/shadcn';
import { Plus, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadItemsProps {
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
        const file = getFile(fileMeta);

        return (
          <FileUploadItem key={key} value={file} className="p-0">
            <FileUploadItemPreview
              className={cn(itemSize)}
              render={(_file, fallback): React.ReactNode => {
                const url = typeof fileMeta.url === 'string' ? fileMeta.url : '';
                if (url.length > 0 && fileMeta.type.startsWith('image/')) {
                  return (
                    // biome-ignore lint/performance/noImgElement: remote preview URLs should render as <img>
                    <img
                      src={url}
                      alt={fileMeta.name}
                      className="size-full object-cover"
                    />
                  );
                }

                return fallback();
              }}
            >
              <FileUploadItemProgress variant="fill" />
            </FileUploadItemPreview>
            <FileUploadItemMetadata className="sr-only" />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="-top-1 -right-1 absolute size-5 rounded-full"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteFile(fileMeta);
              }}
            >
              <X className="size-3" />
            </Button>
          </FileUploadItem>
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
