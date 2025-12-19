import type { JsonSchemaFormComponents } from '../components/json-schema-form-renderer/types';
import type { FormComponentRecord } from '../types/form';
import { useMemo } from 'react';

/**
 * Merges basic component registry with user-provided components.
 * User-provided components will override basic components if the same key exists.
 *
 * @param basicRegistry - The basic component registry (e.g., basicComponentRegistry)
 * @param userComponents - Optional user-provided components to merge/override
 * @returns Merged component configuration
 */
export function useMergedSchemaComponents(
  basicRegistry: FormComponentRecord,
  userComponents?: Partial<JsonSchemaFormComponents>,
): {
  fields: FormComponentRecord;
  decorators?: Record<string, React.ComponentType<any>>;
} {
  return useMemo(
    () => ({
      fields: {
        ...basicRegistry,
        ...(userComponents?.fields ?? {}),
      },
      decorators: userComponents?.decorators,
    }),
    [basicRegistry, userComponents?.decorators, userComponents?.fields],
  );
}
