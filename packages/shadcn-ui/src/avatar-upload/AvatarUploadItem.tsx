import type { FileMetadata } from '../file-upload';

import type { ComponentSize } from './types';

import { cn } from '@pixpilot/shadcn';
import { FileUploadItem, FileUploadItemProgress, useFileUpload } from '@/components';
import { useFileUploadProgressCallbacks } from '../file-upload';
import {
  AvatarWrap,
  Image,
  MainWrapper,
  MessageComponent,
} from './AvatarUploadComponents';

interface AvatarUploadItemProps {
  file: File;
  index: number;
  currentSize: ComponentSize;
  change: string;
  onChange?: (file: FileMetadata) => void;
}

const AvatarUploadItem: React.FC<AvatarUploadItemProps> = (props) => {
  const { file, currentSize, change } = props;

  useFileUploadProgressCallbacks(file, props);

  const isUploading = useFileUpload((store) => {
    const storeFile = store.files.get(file);
    if (storeFile?.status === 'uploading') {
      return true;
    }
    return false;
  });

  return (
    <FileUploadItem value={file} className="p-0 border-0 m-0">
      <MainWrapper currentSize={currentSize}>
        <div className="relative">
          <AvatarWrap
            className={currentSize.avatar}
            showChangeIcon={true}
            iconClass={currentSize.icon}
          >
            <Image src={URL.createObjectURL(file)} />
          </AvatarWrap>
        </div>
        <div className="w-full flex items-center justify-center relative">
          <FileUploadItemProgress variant="linear" className="absolute" />

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
