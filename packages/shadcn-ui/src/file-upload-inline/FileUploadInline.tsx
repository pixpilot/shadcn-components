'use client';

import type { FileUploadInlineProps } from './types';
import {
  Button,
  cn,
  FileUpload,
  FileUploadList,
  FileUploadTrigger,
} from '@pixpilot/shadcn';
import { FileIcon } from 'lucide-react';

import * as React from 'react';
import { useValueToFiles } from '../file-upload/hooks';
import { FileUploadInlineItem } from './FileUploadInlineItem';

/**
 * FileUploadInline - An inline file upload component using FileUpload primitives
 *
 * Features:
 * - Shows a "Browse file" or custom button text
 * - Displays selected filename with truncation
 * - Uses FileUpload component primitives for proper file handling
 * - Clean inline design
 */
export function FileUploadInline({
  value,
  onChange,
  buttonText = 'Browse file',
  showIcon = true,
  showClear = true,
  className,
  accept,
  disabled = false,
  maxSize,
  maxFiles,
  multiple = false,
  onValueChange,
  ...rest
}: FileUploadInlineProps) {
  // Normalize value to always be an array internally
  const files = useValueToFiles(value);

  const handleValueChange = React.useCallback(
    (newFiles: File[]) => {
      onValueChange?.(newFiles);
      if (!onChange) return;

      if (multiple) {
        onChange(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange(newFiles.length > 0 ? newFiles[0]! : null);
      }
    },
    [onValueChange, onChange, multiple],
  );

  return (
    <FileUpload
      {...rest}
      value={files}
      onValueChange={handleValueChange}
      accept={accept}
      maxFiles={maxFiles}
      maxSize={maxSize}
      disabled={disabled}
      multiple={multiple}
      className={cn('space-y-2', className)}
    >
      {(multiple || (!multiple && files.length === 0)) && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border border-input bg-background px-3 ',
            'hover:bg-accent/50 transition-colors m-0',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {showIcon && <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />}

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
        </div>
      )}

      {files.length > 0 && (
        <FileUploadList className="space-y-1 m-0">
          {files.map((file) => (
            <FileUploadInlineItem
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              showClear={showClear}
              disabled={disabled}
            />
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  );
}
