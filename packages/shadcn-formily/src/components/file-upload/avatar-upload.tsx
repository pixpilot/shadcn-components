import type { Field } from '@formily/core';
import type { AvatarUploadProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { AvatarUpload as ShadcnAvatarUpload } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useFileUploadFeedback } from './use-file-upload-feedback';

const BaseAvatarUpload: React.FC<AvatarUploadProps> = (props) => {
  const { onUpload, maxSize, handleFilesRejection, handleFileValidate } =
    useFileUploadFeedback(props);

  return (
    <ShadcnAvatarUpload
      {...props}
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
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? null,
    };
  }),
);
