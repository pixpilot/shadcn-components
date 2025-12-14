'use client';

import type { FileWithMetadata } from './utils';
import {
  Button,
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
import prettyBytes from 'pretty-bytes';
import React from 'react';

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

    const url = typeof fileMeta.url === 'string' ? fileMeta.url : '';

    const shouldRenderProgress =
      storeFile?.status !== 'idle' && storeFile?.progress !== 100 && !hasError;

    const renderPreview = (
      _file: File,
      fallback: () => React.ReactNode,
    ): React.ReactNode => {
      if (url.length > 0 && fileMeta.type.startsWith('image/')) {
        return (
          <div className="relative size-full">
            <img src={url} alt={fileMeta.name} className="size-full object-cover" />
          </div>
        );
      }

      return fallback();
    };

    return (
      <FileUploadItem value={file} className={cn('p-0')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <FileUploadItemPreview
              className={cn(itemSize, 'relative')}
              render={renderPreview}
            >
              {hasError ? (
                <Backdrop className="flex items-center justify-center">
                  <AlertTriangle className="text-destructive size-9" />
                </Backdrop>
              ) : (
                shouldRenderProgress && (
                  <Backdrop>
                    <FileUploadItemProgress variant="circular" strokeWidth={4} />
                  </Backdrop>
                )
              )}
            </FileUploadItemPreview>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {fileMeta.name}
              <br />
              Size: {prettyBytes(fileMeta.size)}
            </p>
            {hasError && (
              <div className="text-destructive flex items-center gap-2 mt-2">
                <AlertTriangle className="text-destructive size-4" />
                <p className="font-bold">{storeFile?.error}</p>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
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
