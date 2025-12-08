import type { IconProvider } from '../types';

/**
 * Validates if a value is a valid IconProvider structure
 */
export function isValidProvider(value: unknown): value is IconProvider {
  return (
    typeof value === 'object' &&
    value !== null &&
    'prefix' in value &&
    'icons' in value &&
    'name' in value &&
    typeof (value as IconProvider).prefix === 'string' &&
    Array.isArray((value as IconProvider).icons)
  );
}
