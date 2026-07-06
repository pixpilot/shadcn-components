import type { HTMLAttributes } from 'react';
import { useFieldSchema } from '@formily/react';
import { useMemo } from 'react';
import { getXComponentProps } from '../../utils';

/**
 * Reads the array field's `items['x-component-props']` and returns them as HTML
 * attributes to spread onto every rendered item's wrapper element.
 *
 * This is the single source of truth for per-item styling/attributes across all
 * array components. It lets consumers style each array item from the item schema:
 *
 * ```ts
 * items: {
 *   type: 'object',
 *   'x-component-props': { className: 'border-primary' },
 * }
 * ```
 *
 * Note: the array node's own `x-component-props` still targets the array component
 * itself (list container / dialog / popover). Per-item props live on `items`.
 */
export function useArrayItemWrapperProps<
  T extends HTMLElement = HTMLDivElement,
>(): HTMLAttributes<T> {
  const schema = useFieldSchema();

  return useMemo(() => {
    const items = Array.isArray(schema?.items)
      ? (schema?.items[0] ?? schema?.items)
      : schema?.items;

    return getXComponentProps<T>(items);
  }, [schema]);
}
