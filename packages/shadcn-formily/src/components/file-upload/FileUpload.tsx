import type { Field } from '@formily/core';
import type { FileUploadProps as ShadcnFileUploadProps } from '@pixpilot/shadcn-ui';
import type { FormilyUploadProps } from './map-upload-props';
import { connect, mapProps } from '@formily/react';
import { FileUpload as ShadcnFileUpload } from '@pixpilot/shadcn-ui';
import React from 'react';
import { mapUploadProps } from './map-upload-props';
import { useFileUploadFeedback } from './use-file-upload-feedback';

export type FileUploadProps = FormilyUploadProps<ShadcnFileUploadProps>;

const BaseFileUpload: React.FC<FileUploadProps> = (props) => {
  const { mapValue: _mapValue, ...uploadProps } = props as FileUploadProps & {
    mapValue?: unknown;
  };
  const { onUpload, maxSize, handleFilesRejection, handleFileValidate } =
    useFileUploadFeedback(uploadProps);

  return (
    <ShadcnFileUpload
      {...uploadProps}
      maxSize={maxSize}
      onFilesReject={handleFilesRejection}
      onFileValidate={handleFileValidate}
      onUpload={onUpload}
    />
  );
};

/**
 * Formily-connected FileUpload component
 * Automatically connects shadcn FileUpload to Formily field state
 */
export const FileUpload = connect(
  BaseFileUpload,
  mapProps((props, field) => mapUploadProps(props, field as Field)),
) as React.FC<FileUploadProps>;
