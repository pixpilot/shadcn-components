import type { FileMetadata, OnChangeMultipleFiles, OnChangeSingleFile } from '../types';
import type { FileWithMetadata } from '../utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  callOnChange,
  handleFileValueChange,
  normalizeToArray,
} from '../../file-upload-inline/utils';
import { getFileMetaAndFile, isFileEqual, mergeFileMetadata } from '../utils';

interface UseFileUploadInlineProps {
  value: FileMetadata | FileMetadata[] | null | undefined;
  onChange: OnChangeMultipleFiles | OnChangeSingleFile | undefined;
  multiple: boolean;
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
}: UseFileUploadInlineProps): UseFileUploadStoreResult {
  const [uploadFiles, setFiles] = useState<File[]>([]);

  const onChangeRef = useRef<typeof onChange>(onChange);
  onChangeRef.current = onChange;

  const fileCacheRef = useRef<Map<string, File>>(new Map());

  const getCacheKey = useCallback(
    (fileMeta: FileWithMetadata) =>
      `${fileMeta.name}-${fileMeta.lastModified}-${fileMeta.type}-${fileMeta.size}`,
    [],
  );

  const getFile = useCallback(
    (fileMeta: FileWithMetadata) => {
      if (fileMeta.file) return fileMeta.file;

      const key = getCacheKey(fileMeta);
      const cached = fileCacheRef.current.get(key);
      if (cached) return cached;

      const created = new File([], fileMeta.name, {
        type: fileMeta.type,
        lastModified: fileMeta.lastModified,
      });

      fileCacheRef.current.set(key, created);
      return created;
    },
    [getCacheKey],
  );

  const handleAccept = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const normalizedFiles = normalizeToArray(value);
      handleFileValueChange(normalizedFiles, acceptedFiles, multiple, onChange);
    },
    [multiple, onChange, value],
  );

  const displayFiles = useMemo(() => {
    if (!value) {
      return uploadFiles.map((file) => getFileMetaAndFile(file));
    }
    const normalizedValue = normalizeToArray(value);
    return mergeFileMetadata(normalizedValue, uploadFiles);
  }, [uploadFiles, value]);

  const orgValue = useMemo(() => displayFiles.map(getFile), [displayFiles, getFile]);

  const deleteUploadFile = useCallback((file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  }, []);

  const deleteFile = useCallback(
    (fileMeta: FileWithMetadata) => {
      if (fileMeta.file) deleteUploadFile(fileMeta.file);

      if (!multiple) {
        (onChangeRef.current as OnChangeSingleFile)?.(null);
        return;
      }

      const updatedFiles = displayFiles.filter((f) => !isFileEqual(f, fileMeta));
      callOnChange(updatedFiles, multiple, onChangeRef.current);
    },
    [displayFiles, multiple, deleteUploadFile],
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
