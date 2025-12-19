'use client';

import type { UseFileUploadStoreResult } from '../file-upload/hooks/use-file-upload-store';
import type { FileUploadInlineProps } from './types';
import {
  Button,
  cn,
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadTrigger,
} from '@pixpilot/shadcn';
import { CloudUpload } from 'lucide-react';
import { useCallback } from 'react';
import { useFileUploadStore } from '../file-upload';
import { defaultOptions } from './defaults';
import { FileUploadInlineItem } from './FileUploadInlineItem';

/**
 * FileUploadInline - An inline file upload component using FileUpload primitives
 */
export function FileUploadInline(props: FileUploadInlineProps) {
  const {
    value,
    onChange,
    className,
    disabled = defaultOptions.disabled,
    multiple = defaultOptions.multiple,
    buttonText = 'Click to upload files',
    showIcon = defaultOptions.showIcon,
    onAccept,
    preventDuplicates,
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
            className={cn(
              'rounded-md border border-input border-solid flex-row bg-background px-3 py-0 display-block w-full cursor-pointer',
              'hover:bg-accent/50 transition-colors m-0',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {showIcon && (
              <CloudUpload className="h-4 w-4 shrink-0 mx-1 text-muted-foreground" />
            )}

            <FileUploadTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto py-2 px-0 text-sm text-muted-foreground hover:no-underline justify-start flex-1"
                disabled={disabled}
              >
                {buttonText}
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
        )}

        {displayFiles.length > 0 && (
          <FileUploadList className="space-y-1 m-0" forceMount>
            {displayFiles.map((data) => {
              const { name, lastModified } = data;

              const key = `${name}-${lastModified}`;

              return (
                <FileUploadInlineItem
                  key={key}
                  {...data}
                  file={getFile(data)}
                  disabled={disabled}
                  onDelete={deleteFile}
                />
              );
            })}
          </FileUploadList>
        )}
      </>
    </FileUpload>
  );
}
