'use client';

import type { UseFileUploadStoreResult } from './hooks/use-file-upload-store';
import type { FileUploadProps } from './types';
import { cn, FileUploadDropzone, FileUpload as OrgFileUpload } from '@pixpilot/shadcn';
import { Upload } from 'lucide-react';
import * as React from 'react';
import { FileUploadItems } from './FileUploadItems';
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
  const containerClasses = cn('p-2');

  return (
    <OrgFileUpload
      {...rest}
      value={orgValue}
      onAccept={handleFileAccept}
      multiple={multiple}
      className={cn('w-full', className)}
    >
      <FileUploadDropzone className={containerClasses}>
        {displayFiles.length === 0 ? (
          <div className="flex flex-col items-center gap-1 text-center p-2">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Or click to browse (max 10 files, up to 5MB each)
            </p>
          </div>
        ) : (
          <FileUploadItems
            displayFiles={displayFiles}
            deleteFile={deleteFile}
            getFile={getFile}
            maxFiles={maxFiles}
            itemSize={itemSize}
            className={containerClasses}
          />
        )}
      </FileUploadDropzone>
    </OrgFileUpload>
  );
}
