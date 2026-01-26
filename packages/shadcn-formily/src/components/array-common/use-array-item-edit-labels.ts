import type { Schema } from '@formily/react';
import { useCallback, useMemo } from 'react';
import { getEditDescription } from './get-edit-description';

/**
 * Hook to get title and description for array item edit dialogs/popovers
 * Uses schema title/description when available, falls back to defaults
 */
export function useArrayItemEditLabels({
  schema,
  isNew,
  autoSave,
  itemIndex,
}: {
  schema?: Schema;
  isNew: boolean;
  autoSave?: boolean;
  itemIndex?: number;
}): { title: string; description: string } {
  const getNonEmptyString = useCallback((value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, []);

  const title = useMemo(() => {
    const schemaTitle = getNonEmptyString(schema?.title as unknown);
    if (schemaTitle !== undefined) {
      return isNew ? `Add ${schemaTitle}` : `Edit ${schemaTitle}`;
    }

    return isNew ? 'Add New Item' : `Edit Item #${(itemIndex ?? 0) + 1}`;
  }, [getNonEmptyString, isNew, itemIndex, schema?.title]);

  const description = useMemo(() => {
    const schemaDescription = getNonEmptyString(schema?.description as unknown);
    if (schemaDescription !== undefined) {
      return schemaDescription;
    }

    return getEditDescription(isNew, autoSave ?? false);
  }, [getNonEmptyString, isNew, autoSave, schema?.description]);

  return { title, description };
}
