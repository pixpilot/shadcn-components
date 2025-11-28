/* eslint-disable ts/no-unsafe-assignment */
/* eslint-disable ts/no-unsafe-member-access */
import type { ArrayField as FormilyArrayField } from '@formily/core';

/**
 * Retrieves the key and record for an array field item at the specified index.
 * The key is derived from the item's 'id' property if available, otherwise falls back to the index.
 * The record is the item data cast as a generic record.
 *
 * @param field - The Formily array field containing the items.
 * @param index - The index of the item in the array.
 * @returns An object containing the itemKey and record.
 */
export function getArrayItemInfo(
  field: FormilyArrayField,
  index: number,
): { itemKey: string | number; record: Record<string, any> } {
  const itemKey = field.value?.[index]?.id ?? index;
  const record = field.value?.[index] as Record<string, any>;

  return { itemKey, record };
}
