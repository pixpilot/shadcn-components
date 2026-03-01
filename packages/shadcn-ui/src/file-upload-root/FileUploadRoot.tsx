'use client';

import type { UseFileUploadStoreResult } from '../file-upload/hooks/use-file-upload-store';
import type { FileUploadRootProps } from './types';
import {
  cn,
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadTrigger,
} from '@pixpilot/shadcn';
import { useCallback } from 'react';
import { useFileUploadStore } from '../file-upload';
import { FileUploadRootItem } from './FileUploadRootItem';

/**
 * FileUploadInline - An inline file upload component using FileUpload primitives
 */
export function FileUploadRoot(props: FileUploadRootProps) {
  const {
    value,
    onChange,
    className,
    disabled,
    multiple = false,
    children,
    onAccept,
    preventDuplicates,
    slots,
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
    preventDuplicates,
  });

  const handleFileAccept = useCallback(
    (files: File[]) => {
      onAccept?.(files);
      handleAccept(files);
    },
    [handleAccept, onAccept],
  );

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line ts/strict-boolean-expressions
    if (!children && !(slots && slots.trigger)) {
      throw new Error(
        'FileUploadRoot requires children or slots.trigger to be passed in.',
      );
    }
  }

  return (
    <FileUpload
      {...rest}
      value={orgValue}
      onAccept={handleFileAccept}
      disabled={disabled}
      multiple={multiple}
      className={cn('space-y-2', className)}
    >
      <>
        {(multiple || (!multiple && displayFiles.length === 0)) && (
          <FileUploadDropzone
            {...(slots?.dropzone || {})}
            className={cn(
              'p-0 border-0 hover:bg-transparent',
              slots?.dropzone?.className,
            )}
          >
            <FileUploadTrigger asChild {...(slots?.trigger || {})}>
              {children}
            </FileUploadTrigger>
          </FileUploadDropzone>
        )}

        {displayFiles.length > 0 && (
          <FileUploadList className="space-y-1 m-0" forceMount>
            {displayFiles.map((data) => {
              const { name, lastModified } = data;

              const key = `${name}-${lastModified}`;

              return (
                <FileUploadRootItem
                  key={key}
                  {...data}
                  file={getFile(data)}
                  disabled={disabled}
                  onDelete={deleteFile}
                  {...(slots?.fileItem || {})}
                />
              );
            })}
          </FileUploadList>
        )}
      </>
    </FileUpload>
  );
}

FileUploadRoot.displayName = 'FileUploadRoot';
