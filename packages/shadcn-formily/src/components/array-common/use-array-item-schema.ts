import type { Schema } from '@formily/react';
import { useFieldSchema } from '@formily/react';
import { useMemo } from 'react';

/**
 * Hook to get the schema for individual array items
 * Handles both single schema and array of schemas (takes first item)
 */
export function useArrayItemSchema(): Schema {
  const schema = useFieldSchema();
  return useMemo(() => {
    if (!schema?.items) {
      throw new Error('Array schema must have items defined');
    }

    const items = Array.isArray(schema.items)
      ? (schema.items[0] ?? schema.items)
      : schema.items;

    return items as Schema;
  }, [schema]);
}
