import type {
  FileMetadata,
  OnChangeMultipleFiles,
  OnChangeSingleFile,
} from '../file-upload/types';
import type { FileWithMetadata } from '../file-upload/utils';
import { mergeFileMetadata } from '../file-upload/utils';

export function normalizeToArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function callOnChange(
  value: FileMetadata[] | FileWithMetadata[],
  multiple: boolean,
  onChange?: OnChangeMultipleFiles | OnChangeSingleFile,
): void {
  const fileMetaDataOnly = (value as FileWithMetadata[]).map(
    ({ file, ...metaData }) => metaData,
  );

  if (multiple) {
    (onChange as OnChangeMultipleFiles)?.(fileMetaDataOnly);
  } else {
    (onChange as OnChangeSingleFile)?.(fileMetaDataOnly[0] ?? null);
  }
}

/**
 * Handles file value change for FileUploadInline component
 * Normalizes files, merges metadata, and calls appropriate onChange callback
 *
 * @param value - The current file value
 * @param acceptedFiles - Files accepted from file input
 * @param multiple - Whether multiple files are allowed
 * @param onChange - onChange callback
 * @returns Object containing merged files and fileMetadataOnly arrays
 */
export function handleFileValueChange(
  value: FileMetadata[] | FileMetadata | null,
  acceptedFiles: File[],
  multiple: boolean,
  onChange?: OnChangeMultipleFiles | OnChangeSingleFile,
): { fileMetaDataOnly: FileMetadata[]; mergedFiles: FileWithMetadata[] } {
  const normalizedFiles = normalizeToArray(value);

  const mergedFiles = mergeFileMetadata(normalizedFiles, acceptedFiles);

  const fileMetaDataOnly: FileMetadata[] = mergedFiles.map(
    ({ file, ...metaData }) => metaData,
  );

  callOnChange(mergedFiles, multiple, onChange);

  return { mergedFiles, fileMetaDataOnly };
}
