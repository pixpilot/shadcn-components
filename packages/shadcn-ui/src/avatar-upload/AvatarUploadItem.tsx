import type { FileUploadCallbacks } from '../file-upload';

import type { ComponentSize } from './types';

import {
  cn,
  FileUploadItem,
  FileUploadItemProgress,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useFileUpload,
} from '@pixpilot/shadcn';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { useFileError, useFileUploadProgressCallbacks } from '../file-upload';
import {
  AvatarWrap,
  Image,
  MainWrapper,
  MessageComponent,
} from './AvatarUploadComponents';

interface AvatarUploadItemProps extends FileUploadCallbacks {
  file: File;
  currentSize: ComponentSize;
  change: string;
  onClear?: () => void;
  onError?: (error: string | null) => void;
}

const AvatarUploadItem: React.FC<AvatarUploadItemProps> = (props) => {
  const {
    file,
    currentSize,
    change = 'Change',
    onFileSuccess,
    onFileError,
    onClear,
    onError,
  } = props;

  useFileUploadProgressCallbacks(file, { onFileSuccess, onFileError });

  const fileError = useFileError(file);

  const isUploading = useFileUpload((store) => {
    if (fileError != null) return false;
    const storeFile = store.files.get(file);
    if (storeFile?.status === 'uploading') {
      return true;
    }
    return false;
  });

  React.useEffect(() => {
    if (fileError != null) {
      onError?.(fileError);
    }

    return () => {
      onError?.(null);
    };
  }, [fileError, onError]);

  return (
    <FileUploadItem value={file} className="p-0 border-0 m-0">
      <MainWrapper currentSize={currentSize}>
        <div className={cn('relative')}>
          <AvatarWrap
            className={currentSize.avatar}
            showChangeIcon={true}
            iconClass={currentSize.icon}
            onClear={onClear}
          >
            <Image src={URL.createObjectURL(file)} />
          </AvatarWrap>
          {fileError != null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="absolute -top-3 -left-3 p-1">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{fileError}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="w-full flex items-center justify-center relative">
          {fileError == null && isUploading && (
            <FileUploadItemProgress variant="linear" className="absolute" />
          )}

          <MessageComponent
            message={change}
            className={cn({ 'opacity-0': isUploading })}
          />
        </div>
      </MainWrapper>
    </FileUploadItem>
  );
};

export { AvatarUploadItem };
