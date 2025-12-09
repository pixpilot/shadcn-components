import type { FileMetadata } from '../types';

export function getFileMeta(file: File): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
