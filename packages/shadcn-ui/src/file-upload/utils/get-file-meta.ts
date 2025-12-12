import type { FileMetadata } from '../types';

export function getFileMeta(file: File): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
}

export function getFileMetaAndFile(file: File): FileMetadata & { file: File } {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    file,
  };
}
