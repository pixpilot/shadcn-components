import type { Field } from '@formily/core';
import type { AvatarUploadProps as ShadcnAvatarUploadProps } from '@pixpilot/shadcn-ui';
import type { FormilyUploadProps } from './map-upload-props';
import { connect, mapProps } from '@formily/react';
import { AvatarUpload as ShadcnAvatarUpload } from '@pixpilot/shadcn-ui';
import React from 'react';
import { mapUploadProps } from './map-upload-props';
import { useFileUploadFeedback } from './use-file-upload-feedback';

export type AvatarUploadProps = FormilyUploadProps<ShadcnAvatarUploadProps>;

const BaseAvatarUpload: React.FC<AvatarUploadProps> = (props) => {
  const { mapValue: _mapValue, ...uploadProps } = props;
  const { onUpload, maxSize, handleFilesRejection, handleFileValidate } =
    useFileUploadFeedback(uploadProps);

  return (
    <ShadcnAvatarUpload
      {...uploadProps}
      maxSize={maxSize}
      onFilesReject={handleFilesRejection}
      onFileValidate={handleFileValidate}
      onUpload={onUpload}
    />
  );
};

/**
 * Formily-connected AvatarUpload component
 * Automatically connects shadcn AvatarUpload to Formily field state
 */
export const AvatarUpload = connect(
  BaseAvatarUpload,
  mapProps((props, field) =>
    mapUploadProps(props, field as Field, { forceSingle: true }),
  ),
) as React.FC<AvatarUploadProps>;
