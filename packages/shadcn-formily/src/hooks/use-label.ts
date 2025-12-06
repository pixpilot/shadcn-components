import type { SyncReactNode } from '../types';
import { useFieldSchema } from '@formily/react';
import { toCapitalCase } from '@pixpilot/string';

export function useLabel(label?: SyncReactNode): SyncReactNode | null {
  const schema = useFieldSchema();
  const name = schema.name as string | undefined;
  const title = schema.title as string | undefined;

  if (label != null) {
    return label;
  }

  if (title != null) {
    return typeof title === 'string' ? toCapitalCase(title) : title;
  }

  if (name != null) {
    return typeof name === 'string' ? toCapitalCase(name) : name;
  }

  return null;
}
