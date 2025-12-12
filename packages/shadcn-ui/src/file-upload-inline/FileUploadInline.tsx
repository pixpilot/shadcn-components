'use client';

import type { FileUploadInlineProps } from './types';
import { cn, FileUpload } from '@pixpilot/shadcn';
import { useCallback, useState } from 'react';
import { defaultOptions } from './defaults';
import { FileUploadContent } from './FileUploadContent';
import { handleFileValueChange, normalizeToArray } from './utils';

/**
 * FileUploadInline - An inline file upload component using FileUpload primitives
 *
 * Features:
 * - Shows a "Browse file" or custom button text
 * - Displays selected filename with truncation
 * - Uses FileUpload component primitives for proper file handling
 * - Clean inline design
 */
export function FileUploadInline(props: FileUploadInlineProps) {
  const {
    value,
    onChange,
    className,
    disabled = defaultOptions.disabled,
    multiple = defaultOptions.multiple,
    buttonText,
    showIcon,
    ...rest
  } = props;

  const [files, setFiles] = useState<File[]>([]);

  const handleAccept = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const normalizedFiles = normalizeToArray(value);
      handleFileValueChange(normalizedFiles, acceptedFiles, multiple, onChange);
    },
    [multiple, onChange, value],
  );

  const handleDelete = useCallback((file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  }, []);

  return (
    <FileUpload
      {...rest}
      value={files}
      onAccept={handleAccept}
      disabled={disabled}
      multiple={multiple}
      className={cn('space-y-2', className)}
    >
      <FileUploadContent {...props} onDelete={handleDelete} files={files} />
    </FileUpload>
  );
}
