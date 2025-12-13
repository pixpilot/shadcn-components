import type { FileMetadata, OnChangeMultipleFiles, OnChangeSingleFile } from '../types';
import type { FileWithMetadata } from '../utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  callOnChange,
  handleFileValueChange,
  normalizeToArray,
} from '../../file-upload-inline/utils';
import { getFileKey, getFileMetaAndFile, isFileEqual, mergeFileMetadata } from '../utils';
import { createPlaceholderFile } from '../utils/create-placeholder-file';

interface UseFileUploadInlineProps {
  value: FileMetadata | FileMetadata[] | null | undefined;
  onChange: OnChangeMultipleFiles | OnChangeSingleFile | undefined;
  multiple: boolean;
  preventDuplicates?: boolean;
}

export interface UseFileUploadStoreResult {
  uploadFiles: File[];
  handleAccept: (acceptedFiles: File[]) => void;
  displayFiles: FileWithMetadata[];
  deleteFile: (file: FileWithMetadata) => void;
  getFile: (fileMeta: FileWithMetadata) => File;
  orgValue: File[];
}

export function useFileUploadStore({
  value,
  onChange,
  multiple,
  preventDuplicates = false,
}: UseFileUploadInlineProps): UseFileUploadStoreResult {
  const [uploadFiles, setFiles] = useState<File[]>([]);

  const onChangeRef = useRef<typeof onChange>(onChange);
  onChangeRef.current = onChange;

  const fileCacheRef = useRef<Map<string, File>>(new Map());

  const getFile = useCallback((fileMeta: FileWithMetadata) => {
    if (fileMeta.file) return fileMeta.file;

    const key = getFileKey(fileMeta);
    const cached = fileCacheRef.current.get(key);
    if (cached) return cached;

    const created = createPlaceholderFile(fileMeta);

    fileCacheRef.current.set(key, created);
    return created;
  }, []);

  const handleAccept = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = preventDuplicates
        ? acceptedFiles.filter((file) => {
            const key = getFileKey(file);
            return !uploadFiles.some((existing) => getFileKey(existing) === key);
          })
        : acceptedFiles;
      setFiles((prev) => [...prev, ...newFiles]);
      const normalizedFiles = normalizeToArray(value);
      handleFileValueChange(normalizedFiles, newFiles, multiple, onChangeRef.current);
    },
    [preventDuplicates, multiple, value, uploadFiles],
  );

  const displayFiles = useMemo(() => {
    const files = (() => {
      if (!value) {
        return uploadFiles.map((file) => getFileMetaAndFile(file));
      }
      const normalizedValue = normalizeToArray(value);
      return mergeFileMetadata(normalizedValue, uploadFiles);
    })();

    // Cache the files for later retrieval
    files.forEach((fileWithMeta) => {
      if (fileWithMeta.file) {
        fileCacheRef.current.set(getFileKey(fileWithMeta), fileWithMeta.file);
      }
    });

    return files;
  }, [uploadFiles, value]);

  const orgValue = useMemo(() => displayFiles.map(getFile), [displayFiles, getFile]);

  const deleteUploadFile = useCallback((file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  }, []);

  const deleteFile = useCallback(
    (fileMeta: FileWithMetadata) => {
      if (fileMeta.file) deleteUploadFile(fileMeta.file);

      const key = getFileKey(fileMeta);
      fileCacheRef.current.delete(key);

      if (!multiple) {
        (onChangeRef.current as OnChangeSingleFile)?.(null);
        return;
      }

      const updatedFiles = displayFiles.filter((f) => !isFileEqual(f, fileMeta));
      callOnChange(updatedFiles, multiple, onChangeRef.current);
    },
    [deleteUploadFile, multiple, displayFiles],
  );

  return {
    uploadFiles,
    handleAccept,
    displayFiles,
    deleteFile,
    getFile,
    orgValue,
  };
}
