import type { FileUploadCallbacks } from '../types';
import { useFileUpload } from '@pixpilot/shadcn';
import { useEffect, useMemo, useRef } from 'react';
import { getFileMeta } from '../utils';

export function useFileUploadProgressCallbacks(
  file: File,
  callBacks: FileUploadCallbacks,
): void {
  const { onFileSuccess, onFileError } = callBacks;

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
      onFileSuccess?.(fileMeta);
    }
  }, [isUploadSuccess, onFileSuccess, fileMeta]);

  useEffect(() => {
    if (uploadError != null && !isErrorTriggered.current) {
      isErrorTriggered.current = true;
      onFileError?.(file, uploadError);
    }
  }, [uploadError, onFileError, file]);
}
