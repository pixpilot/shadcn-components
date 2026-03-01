'use client';

import type { FileUploadInlineProps } from './types';
import { Button, cn } from '@pixpilot/shadcn';
import { CloudUpload } from 'lucide-react';

import { FileUploadRoot } from '../file-upload-root';
import { defaultOptions } from './defaults';

/**
 * FileUploadInline - An inline file upload component using FileUpload primitives
 */
export function FileUploadInline(props: FileUploadInlineProps) {
  const {
    value,
    onChange,
    className,
    disabled = defaultOptions.disabled,
    buttonText: buttonTextProp,
    showIcon = defaultOptions.showIcon,
    onAccept,
    preventDuplicates,
    ...rest
  } = props;

  const multiple = props.multiple ?? defaultOptions.multiple;

  const buttonText =
    buttonTextProp ?? (multiple ? 'Click to upload files' : 'Click to upload a file');

  const dropzoneClassName = cn(
    'rounded-md border border-input border-solid flex-row bg-background px-3 py-0 display-block w-full cursor-pointer',
    'hover:bg-accent/50 transition-colors m-0',
    disabled && 'cursor-not-allowed opacity-50',
  );

  return (
    <FileUploadRoot
      {...rest}
      // eslint-disable-next-line ts/no-unsafe-assignment
      value={value as any}
      onAccept={onAccept}
      disabled={disabled}
      // eslint-disable-next-line ts/no-unsafe-assignment
      multiple={multiple as any}
      className={cn('space-y-2', className)}
      slots={{
        trigger: {
          className: dropzoneClassName,
        },
      }}
    >
      <Button
        variant="link"
        size="sm"
        className={cn(
          'h-auto py-2 px-0 text-sm text-muted-foreground hover:no-underline  flex-1',
          showIcon ? 'justify-start' : 'justify-center',
        )}
        disabled={disabled}
      >
        {showIcon && (
          <CloudUpload className="h-4 w-4 shrink-0 mx-1 text-muted-foreground" />
        )}
        <span>{buttonText}</span>
      </Button>
    </FileUploadRoot>
  );
}
