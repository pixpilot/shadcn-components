import type { FileMetadata } from '../types';

export function createPlaceholderFile(meta: FileMetadata): File {
  return new File([], meta.name, {
    type: meta.type,
    lastModified: meta.lastModified,
  });
}
