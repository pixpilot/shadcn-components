import type { ArrayField as FormilyArrayField } from '@formily/core';

// 1. Create a WeakMap outside the function to store IDs for object references
const itemKeyMap = new WeakMap<object, string>();

let generatedIdCounter = 0;
const BASE_36 = 36;
const RANDOM_SLICE_START = 2;
const RANDOM_SLICE_END = 10;

function createGeneratedId() {
  generatedIdCounter += 1;
  return `pp-${Date.now().toString(BASE_36)}-${generatedIdCounter}-${Math.random()
    .toString(BASE_36)
    .slice(RANDOM_SLICE_START, RANDOM_SLICE_END)}`;
}

export function getArrayItemInfo(
  field: FormilyArrayField,
  index: number,
): { itemKey: string | number; record: Record<string, any> } {
  const value: unknown = field.value?.[index];

  const isObject = (val: unknown): val is Record<string, unknown> =>
    typeof val === 'object' && val !== null;

  const record: Record<string, unknown> = isObject(value) ? value : {};

  if (!isObject(value)) {
    return { itemKey: index, record };
  }

  let stableId = itemKeyMap.get(record);
  if (stableId == null) {
    if (Object.hasOwn(record, 'id') && record.id != null) {
      stableId = String(record.id);
    } else {
      stableId = createGeneratedId();
    }
    itemKeyMap.set(record, stableId);
  }

  return { itemKey: stableId, record };
}
