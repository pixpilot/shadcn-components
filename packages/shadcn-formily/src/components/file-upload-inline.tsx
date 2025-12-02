import type { Field } from '@formily/core';
import type { FileUploadInlineProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps, useField } from '@formily/react';
import { FileUploadInline as ShadcnFileUploadInline } from '@pixpilot/shadcn-ui';
import prettyBytes from 'pretty-bytes';
import React from 'react';

const DEFAULT_MAX_SIZE = 2097152; // 2 megabytes in bytes

const BaseFileUploadInline: React.FC<FileUploadInlineProps> = (props) => {
  const { onFilesReject, maxSize = DEFAULT_MAX_SIZE, onFileValidate } = props;

  const field = useField<Field>();

  const handleFilesRejection = React.useCallback(
    (files: Array<{ file: File; message: string }>) => {
      onFilesReject?.(files);

      // Check if any message starts with "Maximum"
      const maximumError = files.filter((f) => f.message.startsWith('Maximum'));
      const withFileSizeError = files.filter((f) =>
        f.message.startsWith('File too large'),
      );
      const otherErrors = files.filter(
        (f) => !withFileSizeError.includes(f) && !maximumError.includes(f),
      );

      const messages: string[] = [];

      // Add the Maximum error only once (without filename)
      if (maximumError.length > 0) {
        messages.push(maximumError[0]!.message);
      }

      if (withFileSizeError.length > 0) {
        const fileList = withFileSizeError
          .map((f) => `${f.file.name} (${prettyBytes(f.file.size)})`)
          .join('\n');

        messages.push(`Files exceed ${prettyBytes(maxSize)} limit:\n${fileList}`);
      }

      // Add other messages with filenames
      if (otherErrors.length > 0) {
        otherErrors.forEach((f) => {
          messages.push(`${f.message}: ${f.file.name}`);
        });
      }

      field.setFeedback({
        type: 'warning',
        messages: [messages.join('\n')],
      });
    },
    [field, maxSize, onFilesReject],
  );

  const handleFileValidate = React.useCallback(
    (file: File) => {
      field.setFeedback({
        type: 'warning',
        messages: [],
      });
      return onFileValidate?.(file);
    },
    [field, onFileValidate],
  );

  return (
    <ShadcnFileUploadInline
      {...props}
      maxSize={maxSize}
      onFilesReject={handleFilesRejection}
      onFileValidate={handleFileValidate}
    />
  );
};

/**
 * Formily-connected FileUploadInline component
 * Automatically connects shadcn FileUploadInline to Formily field state
 */
export const FileUploadInline = connect(
  BaseFileUploadInline,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? null,
    };
  }),
);
