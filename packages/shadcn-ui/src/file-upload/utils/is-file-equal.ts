import type { FileMetadata } from '../types';

export function isFileEqual(
  a: FileMetadata | null | undefined,
  b: FileMetadata | null | undefined,
): boolean {
  if (!a || !b) return false;
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}
