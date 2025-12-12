import type { OnChangeSingleFile } from '../file-upload/types';
import type { FileWithMetadata } from '../file-upload/utils';
import type { FileUploadInlineProps } from './types';
import { Button, cn, FileUploadList, FileUploadTrigger } from '@pixpilot/shadcn';
import { FileIcon } from 'lucide-react';

import React from 'react';

import { getFileMeta, mergeFileMetadata } from '../file-upload/utils';
import { defaultOptions } from './defaults';
import { FileItem } from './FileUploadInlineItem';
import { callOnChange, normalizeToArray } from './utils';

const FileUploadContent: React.FC<
  FileUploadInlineProps & { onDelete: (file: File) => void; files: File[] }
> = (props) => {
  const {
    value,
    onChange,
    buttonText = defaultOptions.buttonText,
    showIcon = defaultOptions.showIcon,
    disabled = defaultOptions.disabled,
    multiple = defaultOptions.multiple,
    onDelete,
    files: uploadFiles = [],
  } = props;

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const valueRef = React.useRef(value);
  valueRef.current = value;

  // const uploadFiles = useFileUpload((s) => {
  //   const fileArray = Array.from(s.files.keys());

  //   // Check if lengths differ first
  //   let shouldUpdateUploadFilesRef = fileArray.length !== uploadFilesRef.current.length;

  //   // If lengths match, check file-by-file for changes
  //   if (!shouldUpdateUploadFilesRef) {
  //     for (let i = 0; i < fileArray.length; i++) {
  //       if (fileArray[i] !== uploadFilesRef.current[i]) {
  //         shouldUpdateUploadFilesRef = true;
  //         break;
  //       }
  //     }
  //   }

  //   // Only update if there are actual changes
  //   if (shouldUpdateUploadFilesRef) {
  //     uploadFilesRef.current = fileArray;
  //   }

  //   return uploadFilesRef.current;
  // });

  // Removed console.log for lint compliance

  // React.useEffect(() => {
  //   const normalizedFiles = normalizeToArray(valueRef.current);

  //   handleFileValueChange(normalizedFiles, uploadFiles, multiple, onChangeRef.current);
  // }, [multiple, uploadFiles]);

  const fileItems = React.useMemo(() => {
    if (!value) {
      return uploadFiles.map((file) => getFileMeta(file));
    }
    const normalizedValue = normalizeToArray(value);
    return mergeFileMetadata(normalizedValue, uploadFiles);
  }, [uploadFiles, value]);

  const handleDeleteFileFormValue = React.useCallback(
    (file: FileWithMetadata) => {
      if (!multiple) {
        (onChangeRef.current as OnChangeSingleFile)?.(null);
        return;
      }

      if (file.file) onDelete(file.file);
      // } else {
      const updatedFiles = fileItems.filter(
        (f) =>
          !(
            f?.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
          ),
      );
      callOnChange(updatedFiles, multiple, onChangeRef.current);
      // }
    },
    [fileItems, multiple, onDelete],
  );

  return (
    <>
      {(multiple || (!multiple && fileItems.length === 0)) && (
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

      {fileItems.length > 0 && (
        <FileUploadList className="space-y-1 m-0" forceMount>
          {fileItems.map((data) => {
            const { name, lastModified } = data;

            const key = `${name}-${lastModified}`;

            return (
              <FileItem
                key={key}
                {...data}
                disabled={disabled}
                onDelete={handleDeleteFileFormValue}
              />
            );
          })}
        </FileUploadList>
      )}
    </>
  );
};

FileUploadContent.displayName = 'FileUploadContent';

export { FileUploadContent };
