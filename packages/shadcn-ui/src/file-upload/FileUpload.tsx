'use client';

import type { UseFileUploadStoreResult } from './hooks/use-file-upload-store';
import type { FileUploadProps } from './types';
import type { FileWithMetadata } from './utils';
import {
  cn,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUpload as OrgFileUpload,
} from '@pixpilot/shadcn';
import { Plus, Upload, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useFileUploadStore } from './hooks/use-file-upload-store';

export function FileUpload(props: FileUploadProps) {
  const {
    value,
    onChange,
    className,
    multiple = true,
    onAccept,
    maxFiles,
    ...rest
  } = props;

  const {
    handleAccept,
    displayFiles,
    deleteFile,
    getFile,
    orgValue,
  }: UseFileUploadStoreResult = useFileUploadStore({
    value,
    onChange,
    multiple,
  });

  const handleFileAccept = React.useCallback(
    (files: File[]) => {
      onAccept?.(files);
      handleAccept(files);
    },
    [handleAccept, onAccept],
  );

  const itemSize = 'size-22';

  return (
    <OrgFileUpload
      {...rest}
      value={orgValue}
      onAccept={handleFileAccept}
      multiple={multiple}
      className={cn('w-full', className)}
    >
      <FileUploadDropzone className="p-2">
        {displayFiles.length === 0 ? (
          <>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Drag & drop files here</p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (max 10 files, up to 5MB each)
              </p>
            </div>
          </>
        ) : (
          <FileUploadList
            orientation="horizontal"
            forceMount
            className="flex-wrap gap-4 w-full"
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
        )}
      </FileUploadDropzone>
    </OrgFileUpload>
  );
}
