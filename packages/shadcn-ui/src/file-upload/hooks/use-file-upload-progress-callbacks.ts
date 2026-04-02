import type { FileMetadata } from '../types';
import { useFileUpload } from '@pixpilot/shadcn';
import { useEffect, useMemo, useRef } from 'react';
import { getFileMeta } from '../utils';

interface UseFileCallbacks {
  onChange?: (fileMeta: FileMetadata) => void;
  onError?: (file: File, error: Error) => void;
}

export function useFileUploadProgressCallbacks(
  file: File,
  callBacks: UseFileCallbacks,
): void {
  const { onChange, onError } = callBacks;

  const fileMeta = useMemo(() => getFileMeta(file), [file]);

  const isChangeTrigged = useRef<boolean>(false);
  const isErrorTriggered = useRef<boolean>(false);

  const isUploadSuccess = useFileUpload((store) => {
    const storeFile = store.files.get(file);
    if (storeFile?.status === 'success') {
      storeFile.status = 'idle';
      return true;
    }
    return false;
  });

  const uploadError = useFileUpload((store) => {
    const storeFile = store.files.get(file);
    if (storeFile?.status === 'error') {
      return storeFile.error ?? 'Upload failed';
    }
    return null;
  });

  useEffect(() => {
    if (isUploadSuccess && !isChangeTrigged.current) {
      isChangeTrigged.current = true;
      onChange?.(fileMeta);
    }
  }, [isUploadSuccess, onChange, fileMeta]);

  useEffect(() => {
    if (uploadError != null && !isErrorTriggered.current) {
      isErrorTriggered.current = true;
      onError?.(file, new Error(uploadError));
    }
  }, [uploadError, onError, file]);
}
