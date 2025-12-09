'use client';

import {
  Button,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';

interface FileUploadInlineItemProps {
  file: File;
  showClear?: boolean;
  disabled?: boolean;
  showProgress?: boolean;
}

export function FileUploadInlineItem({
  file,
  showClear = true,
  disabled = false,
  showProgress = false,
}: FileUploadInlineItemProps) {
  return (
    <FileUploadItem
      key={`${file.name}-${file.size}-${file.lastModified}`}
      value={file}
      className="flex flex-col gap-2 rounded-md border border-input bg-background px-3 py-2 m-0 w-full"
    >
      <div className="flex w-full gap-2">
        <FileUploadItemMetadata className="min-w-0 flex-1" />
        {showClear && !disabled && (
          <FileUploadItemDelete asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label="Remove file"
            >
              <XIcon className="h-3.5 w-3.5" />
            </Button>
          </FileUploadItemDelete>
        )}
      </div>
      {showProgress && <FileUploadItemProgress variant="linear" className="h-1 w-full" />}
    </FileUploadItem>
  );
}
