import type { SingleFileUploadProps } from '../file-upload';
import type { ComponentSizes, Size } from './types';

import { FileUpload, FileUploadDropzone, FileUploadList } from '@pixpilot/shadcn';
import { UserCircle2 } from 'lucide-react';

import React from 'react';

import { cn } from '@/lib';
import {
  AvatarWrap,
  Image,
  MainWrapper,
  MessageComponent,
} from './AvatarUploadComponents';
import { AvatarUploadItem } from './AvatarUploadItem';

export interface AvatarUploadProps extends SingleFileUploadProps {
  messages?: {
    upload?: string;
    change?: string;
  };
  size?: Size;
  /**
   * When `true` (the default), a small × button is displayed on the avatar
   * whenever there is an image loaded. Clicking it clears the current value.
   * Set to `false` to hide the button.
   */
  clearable?: boolean;
}

const sizeClasses: ComponentSizes = {
  sm: { dropZone: 'p-3', main: 'space-y-2' },
  md: {
    main: 'space-y-2.5',
    dropZone: 'p-4',
  },
  lg: {
    dropZone: 'p-5',
    main: 'space-y-3',
  },
};

const AvatarUpload: React.FC<AvatarUploadProps> = (props) => {
  const {
    className,
    messages,
    value,
    onAccept,
    onFileSuccess,
    onFileError,
    onChange,
    size = 'md',
    clearable = true,
    ...rest
  } = props;
  const { upload = 'Upload', change = 'Change' } = messages || {};

  const currentSize = sizeClasses[size];

  const [selectedFile, setSelectedFile] = React.useState<{
    file: File;
    id: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const imageUrl = value?.url;

  const handleAccept = React.useCallback(
    (acceptedFiles: File[]) => {
      const nextFile = acceptedFiles[0];

      setSelectedFile(
        nextFile == null
          ? null
          : {
              file: nextFile,
              id: `${nextFile.name}-${nextFile.lastModified.toString()}`,
            },
      );
      onAccept?.(nextFile == null ? [] : [nextFile]);
    },
    [onAccept],
  );

  const handleClear = React.useCallback(() => {
    setSelectedFile(null);
    onChange?.(null);
  }, [onChange]);

  const hasImageUrl = imageUrl != null;
  const showClearButton = clearable && (selectedFile != null || hasImageUrl);

  return (
    <FileUpload
      {...rest}
      multiple={false}
      onAccept={handleAccept}
      className={cn('w-fit ', className)}
      accept="image/*"
      data-slots="avatar-upload"
    >
      <FileUploadDropzone
        className={cn(error != null && 'border-red-500', currentSize.dropZone)}
      >
        {selectedFile != null ? (
          <FileUploadList>
            <AvatarUploadItem
              key={selectedFile.id}
              file={selectedFile.file}
              currentSize={currentSize}
              change={change}
              onFileSuccess={onFileSuccess}
              onError={setError}
              onFileError={onFileError}
              onClear={showClearButton ? handleClear : undefined}
              size={size}
            />
          </FileUploadList>
        ) : (
          <MainWrapper currentSize={currentSize}>
            <AvatarWrap
              showChangeIcon={hasImageUrl}
              onClear={showClearButton ? handleClear : undefined}
              size={size}
            >
              {hasImageUrl ? (
                <Image src={imageUrl} />
              ) : (
                <UserCircle2
                  className="text-muted-foreground w-full h-full"
                  strokeWidth={1}
                />
              )}
            </AvatarWrap>
            <MessageComponent message={hasImageUrl ? change : upload} />
          </MainWrapper>
        )}
      </FileUploadDropzone>
    </FileUpload>
  );
};

AvatarUpload.displayName = 'AvatarUpload';

export { AvatarUpload };
