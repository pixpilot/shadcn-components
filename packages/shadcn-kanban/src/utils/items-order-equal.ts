import type { KanbanItem } from '../types';

/** Serialises the only things a drag can change: column membership and order. */
function orderKey<T>(items: readonly KanbanItem<T>[]): string {
  return JSON.stringify(items.map((item) => [item.id, item.columnId]));
}

/** Whether two item lists hold the same cards, in the same columns and order. */
export function itemsOrderEqual<T>(
  a: readonly KanbanItem<T>[],
  b: readonly KanbanItem<T>[],
): boolean {
  return orderKey(a) === orderKey(b);
}
