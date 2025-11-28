import type { ArrayOperationTypes } from '../components/types';
import { defaultOperationComponents } from '../components/components';

interface ComponentInfo {
  Component: React.FC<any>;
  isUserField: boolean;
}

type SchemaComponentsMap = Map<string, ComponentInfo>;

/**
 * Filters and sorts array components based on the operations array.
 * - Filters components that are in defaultOperations and either in the operations array or are user fields
 * - Sorts components according to the order specified in the operations array
 * - User fields come after explicitly ordered operations
 *
 * @param schemaComponents - Map of component keys to component info
 * @param operations - Array of operations to include, or false/undefined for all user fields
 * @returns Sorted array of [key, component info] tuples
 */
export function filterAndSortComponents(
  schemaComponents: SchemaComponentsMap,
  operations?: ArrayOperationTypes[] | false,
): Array<[string, ComponentInfo]> {
  const filtered = Array.from(schemaComponents.entries()).filter(([key, info]) => {
    const isDefaultOp = key in defaultOperationComponents;
    if (!isDefaultOp) return false;
    if (Array.isArray(operations)) {
      return operations.includes(key as ArrayOperationTypes) || info.isUserField === true;
    }
    return info.isUserField === true;
  });

  // Sort based on operations order if operations is an array
  if (!Array.isArray(operations)) {
    return filtered;
  }

  return filtered.sort(([keyA], [keyB]) => {
    const indexA = operations.indexOf(keyA as ArrayOperationTypes);
    const indexB = operations.indexOf(keyB as ArrayOperationTypes);
    // User fields come after explicitly ordered operations
    const aIsOrdered = indexA !== -1;
    const bIsOrdered = indexB !== -1;
    if (aIsOrdered && bIsOrdered) return indexA - indexB;
    if (aIsOrdered) return -1;
    if (bIsOrdered) return 1;
    return 0;
  });
}
