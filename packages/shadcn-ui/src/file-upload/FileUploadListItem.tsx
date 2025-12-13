'use client';

import type { FileWithMetadata } from './utils';
import {
  cn,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useFileUpload,
} from '@pixpilot/shadcn';
import { AlertTriangle, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadListItemProps {
  fileMeta: FileWithMetadata;
  deleteFile: (fileMeta: FileWithMetadata) => void;
  getFile: (fileMeta: FileWithMetadata) => File;
  itemSize: string;
}

const Backdrop: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={cn('bg-black/70 inset-0 absolute', className)}>{children}</div>;
};

const FileUploadListItem = React.memo<FileUploadListItemProps>(
  ({ fileMeta, deleteFile, getFile, itemSize }) => {
    const file = getFile(fileMeta);

    const storeFile = useFileUpload((store) => store.files.get(file));

    const hasError = storeFile?.error != null;

    const shouldRenderProgress = storeFile?.progress !== 100 && !hasError;

    return (
      <FileUploadItem value={file} className={cn('p-0')}>
        <FileUploadItemPreview
          className={cn(itemSize, 'relative')}
          render={(_file, fallback): React.ReactNode => {
            const url = typeof fileMeta.url === 'string' ? fileMeta.url : '';

            if (url.length > 0 && fileMeta.type.startsWith('image/')) {
              return (
                <div className="relative size-full">
                  {/* biome-ignore lint/performance/noImgElement: remote preview URLs should render as <img> */}
                  <img src={url} alt={fileMeta.name} className="size-full object-cover" />
                </div>
              );
            }

            return fallback();
          }}
        >
          {hasError ? (
            <Backdrop className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="text-destructive size-9" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{storeFile?.error}</p>
                </TooltipContent>
              </Tooltip>
            </Backdrop>
          ) : null}
          {shouldRenderProgress && (
            <Backdrop>
              <FileUploadItemProgress variant="circular" strokeWidth={4} />
            </Backdrop>
          )}
        </FileUploadItemPreview>
        <FileUploadItemMetadata className="sr-only" />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="-top-1 -right-1 absolute size-5 rounded-full"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteFile(fileMeta);
          }}
        >
          <X className="size-3" />
        </Button>
      </FileUploadItem>
    );
  },
);

FileUploadListItem.displayName = 'FileUploadListItem';

export { FileUploadListItem };
