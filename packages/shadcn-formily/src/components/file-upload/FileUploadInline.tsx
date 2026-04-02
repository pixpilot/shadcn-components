import type { Field } from '@formily/core';
import type { FileUploadInlineProps as ShadcnFileUploadInlineProps } from '@pixpilot/shadcn-ui';
import type { FormilyUploadProps } from './map-upload-props';
import { connect, mapProps } from '@formily/react';
import { FileUploadInline as ShadcnFileUploadInline } from '@pixpilot/shadcn-ui';
import React from 'react';
import { mapUploadProps } from './map-upload-props';
import { useFileUploadFeedback } from './use-file-upload-feedback';

export type FileUploadInlineProps = FormilyUploadProps<ShadcnFileUploadInlineProps>;

const BaseFileUploadInline: React.FC<FileUploadInlineProps> = (props) => {
  const { mapValue: _mapValue, ...uploadProps } = props as FileUploadInlineProps & {
    mapValue?: unknown;
  };
  const { onUpload, maxSize, handleFilesRejection, handleFileValidate } =
    useFileUploadFeedback(uploadProps);

  return (
    <ShadcnFileUploadInline
      {...uploadProps}
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
  mapProps((props, field) => mapUploadProps(props, field as Field)),
) as React.FC<FileUploadInlineProps>;
