import type { Field } from '@formily/core';
import type { FileUploadBaseProps } from '@pixpilot/shadcn-ui';
import { useField } from '@formily/react';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import { useFormContext } from '../../hooks';

export function useFileUploadFeedback(props: FileUploadBaseProps): {
  onUpload: ((...args: any[]) => any) | undefined;
  maxSize: number | undefined;
  handleFilesRejection: (files: Array<{ file: File; message: string }>) => void;
  handleFileValidate: (file: File) => string | null | undefined;
} {
  const {
    onUpload: onUploadProp,
    maxSize: maxSizeProp,
    onFilesReject,
    onFileValidate,
  } = props;

  const { config } = useFormContext();

  const field = useField<Field>();

  const { fileUpload } = config || {};

  const onUpload = onUploadProp ?? fileUpload?.onUpload;

  const maxSize = maxSizeProp ?? fileUpload?.maxSize;

  if (onUpload == null) {
    // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'onUpload prop required for FileUploadInline. Provide handler on form or field props.',
      );
    }
  }

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

      if (maxSize != null && withFileSizeError.length > 0) {
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

  return { onUpload, maxSize, handleFilesRejection, handleFileValidate };
}
