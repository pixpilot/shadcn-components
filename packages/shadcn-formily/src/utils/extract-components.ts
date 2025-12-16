import type { FormComponentConfig } from '../types/form';

/**
 * Extracts React components from FormComponentConfig records
 */
export function extractComponents<T extends Record<string, FormComponentConfig>>(
  configs: T,
): { [K in keyof T]: T[K]['component'] } {
  return Object.fromEntries(
    Object.entries(configs).map(([key, config]) => [key, config.component]),
  ) as { [K in keyof T]: T[K]['component'] };
}
