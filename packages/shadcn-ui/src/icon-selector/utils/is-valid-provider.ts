import type { IconProviderProps } from '../types';

/**
 * Validates if a value is a valid IconProvider structure
 */
export function isValidProvider(value: unknown): value is IconProviderProps {
  return (
    typeof value === 'object' &&
    value !== null &&
    'prefix' in value &&
    'icons' in value &&
    'name' in value &&
    typeof (value as IconProviderProps).prefix === 'string' &&
    Array.isArray((value as IconProviderProps).icons)
  );
}
