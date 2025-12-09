import React from 'react';

export function useValueToFiles(value: File | File[] | null | undefined): File[] {
  const files = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  return files;
}
