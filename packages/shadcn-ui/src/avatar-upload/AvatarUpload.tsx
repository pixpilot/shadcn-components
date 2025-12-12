import type { SingleFileUploadProps } from '../file-upload';
import type { ComponentSizes } from './types';

import { UserCircle2 } from 'lucide-react';
import React from 'react';

import { FileUpload, FileUploadDropzone, FileUploadList } from '@/components';

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
  size?: keyof ComponentSizes;
}

const sizeClasses: ComponentSizes = {
  sm: { avatar: 'h-20 w-20', icon: 'h-5 w-5', dropZone: 'p-3', main: 'space-y-2' },
  md: {
    main: 'space-y-2.5',
    avatar: 'h-28 w-28',
    icon: 'h-6 w-6 bottom-1 right-1',
    dropZone: 'p-4',
  },
  lg: {
    avatar: 'h-40 w-40',
    icon: 'h-7 w-7 bottom-1.5 right-1.5',
    dropZone: 'p-5',
    main: 'space-y-3',
  },
};

const AvatarUpload: React.FC<AvatarUploadProps> = (props) => {
  const { className, messages, value, onAccept, onChange, size = 'md', ...rest } = props;
  const { upload = 'Upload', change = 'Change' } = messages || {};

  const currentSize = sizeClasses[size];

  const [files, setFiles] = React.useState<{ file: File; id: string }[]>([]);

  const imageUrl = value?.url;

  const handleAccept = React.useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) => {
          return {
            file,
            id: `${file.name}-${file.lastModified.toString()}`,
          };
        }),
      );
      onAccept?.(acceptedFiles);
    },
    [onAccept],
  );

  const hasImageUrl = imageUrl != null;

  return (
    <FileUpload
      {...rest}
      onAccept={handleAccept}
      className={cn('w-fit', className)}
      accept="image/*"
    >
      <FileUploadDropzone className={currentSize.dropZone}>
        {files.length > 0 ? (
          <FileUploadList>
            {files.map(({ file, id }, i) => (
              <AvatarUploadItem
                key={id}
                file={file}
                index={i}
                currentSize={currentSize}
                change={change}
                onChange={onChange}
              />
            ))}
          </FileUploadList>
        ) : (
          <MainWrapper currentSize={currentSize}>
            <AvatarWrap
              className={currentSize.avatar}
              iconClass={currentSize.icon}
              showChangeIcon={hasImageUrl}
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
            <MessageComponent message={hasImageUrl != null ? change : upload} />
          </MainWrapper>
        )}
      </FileUploadDropzone>
    </FileUpload>
  );
};

AvatarUpload.displayName = 'AvatarUpload';

export { AvatarUpload };
