import type { FileMetadata } from '../types';

export function getFileKey(file: FileMetadata): string {
  return `${file.name}-${file.lastModified}-${file.type}-${file.size}`;
}
