import type { FileMetadata } from '../types';

export interface FileWithMetadata extends FileMetadata {
  file?: File;
}

/**
 * Merges newly selected files with existing files (when multiple is true)
 * Removes duplicates by filename and lastModified, keeping all unique versions
 *
 * @param existingFiles - The current files from value prop
 * @param newFiles - The newly selected File objects from input
 * @returns Array of merged FileMetadata objects
 */
export function mergeFileMetadata(
  existingFiles: FileMetadata[],
  newFiles: File[],
): FileWithMetadata[] {
  // Create a map of existing files by name and lastModified for quick lookup
  const fileMap = new Map<string, FileWithMetadata>();

  // Add existing files to map
  existingFiles.forEach((fileMetaData) => {
    const key = `${fileMetaData.name}-${fileMetaData.lastModified}`;
    fileMap.set(key, fileMetaData);
  });

  // Add or update with new files (new files always win)
  newFiles.forEach((file) => {
    const key = `${file.name}-${file.lastModified}`;
    fileMap.set(key, {
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      size: file.size,
      file,
    });
  });

  // Return as array
  return Array.from(fileMap.values());
}
