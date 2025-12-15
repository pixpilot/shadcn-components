import type { SyncReactNode } from '../types';
import { useFieldSchema } from '@formily/react';
import { toCapitalCase } from '@pixpilot/string';
import { useFormConfig } from './use-form-context';

function shouldHaveLabel(value: any) {
  if (typeof value === 'boolean' && value === false) {
    return false;
  }
  return true;
}

export function useLabel(label?: SyncReactNode): SyncReactNode | null {
  const schema = useFieldSchema();
  const name = schema.name as string | undefined;
  const title = schema.title as string | undefined;

  const config = useFormConfig();
  const { useFieldNameAsLabel } = config.label || {};

  if (!shouldHaveLabel(label) || !shouldHaveLabel(title)) {
    return null;
  }

  if (label != null) {
    return label;
  }

  if (title != null) {
    return title;
  }

  if (name != null && useFieldNameAsLabel) {
    return typeof name === 'string' ? toCapitalCase(name) : name;
  }

  return null;
}
