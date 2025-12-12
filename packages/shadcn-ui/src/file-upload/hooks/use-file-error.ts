import { useFileUpload } from '@/components';

export function useFileError(file: File): string | null {
  const fileError = useFileUpload((store) => {
    const storeFile = store.files.get(file);
    if (storeFile?.error != null) {
      return storeFile.error;
    }
    return null;
  });

  return fileError;
}
