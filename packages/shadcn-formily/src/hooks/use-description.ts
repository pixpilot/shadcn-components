import type { SyncReactNode } from '../types';
import { useFieldSchema } from '@formily/react';

export function useDescription(description?: SyncReactNode): SyncReactNode | null {
  const schema = useFieldSchema();
  const desc = schema.description as string | undefined;

  if (description != null) {
    return description;
  }

  if (desc != null) {
    return desc;
  }

  return null;
}
