import type { Field } from '@formily/core';
import type { FileUploadInlineProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { FileUploadInline as ShadcnFileUploadInline } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useFileUploadFeedback } from './use-file-upload-feedback';

const BaseFileUploadInline: React.FC<FileUploadInlineProps> = (props) => {
  const { onUpload, maxSize, handleFilesRejection, handleFileValidate } =
    useFileUploadFeedback(props);

  return (
    <ShadcnFileUploadInline
      {...props}
      maxSize={maxSize}
      onFilesReject={handleFilesRejection}
      onFileValidate={handleFileValidate}
      onUpload={onUpload}
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
