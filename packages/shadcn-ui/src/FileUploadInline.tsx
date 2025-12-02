'use client';

import type { FileUploadProps } from '@internal/shadcn';
import {
  Button,
  cn,
  FileUpload,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  FileUploadTrigger,
} from '@internal/shadcn';
import { FileIcon, XIcon } from 'lucide-react';
import * as React from 'react';

export interface FileUploadInlineProps extends Omit<FileUploadProps, 'value'> {
  /**
   * The current file value (single file or array)
   */
  value?: File | File[] | null;
  /**
   * Callback when file changes
   */
  onChange?: (file: File | File[] | null) => void;
  /**
   * Button text when no file is selected
   */
  buttonText?: string;
  /**
   * Show file icon
   */
  showIcon?: boolean;
  /**
   * Whether to show a clear button when a file is selected
   */
  showClear?: boolean;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Accepted file types
   */
  accept?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Maximum number of files (for multiple uploads)
   */
  maxFiles?: number;
  /**
   * Allow multiple file selection
   */
  multiple?: boolean;
}

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
  maxFiles = 2,
  multiple = false,
  ...rest
}: FileUploadInlineProps) {
  // Normalize value to always be an array internally
  const files = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleValueChange = React.useCallback(
    (newFiles: File[]) => {
      if (!onChange) return;

      if (multiple) {
        onChange(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange(newFiles.length > 0 ? newFiles[0]! : null);
      }
    },
    [onChange, multiple],
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
            <FileUploadItem
              key={`${file.name}-${file.size}-${file.lastModified}`}
              value={file}
              className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 m-0"
            >
              <FileUploadItemMetadata className="min-w-0 flex-1" />
              {showClear && !disabled && (
                <FileUploadItemDelete asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    aria-label="Remove file"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                </FileUploadItemDelete>
              )}
            </FileUploadItem>
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  );
}
