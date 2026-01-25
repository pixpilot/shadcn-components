import type { ArrayField as FormilyArrayField } from '@formily/core';
import { useField } from '@formily/react';
import React from 'react';

export function useArrayDataSource(): any[] {
  const field = useField<FormilyArrayField>();
  return React.useMemo(
    // eslint-disable-next-line ts/no-unsafe-return
    () => (Array.isArray(field.value) ? field.value : []),
    [field.value],
  );
}
