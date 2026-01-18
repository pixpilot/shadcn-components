import type { HTMLAttributes } from 'react';

type UnknownRecord = Record<string, unknown>;

function isObjectLike(value: unknown): value is UnknownRecord {
  return value != null && typeof value === 'object';
}

/**
 * Extracts Formily `x-component-props` from a schema-like object and returns it as
 * HTML attributes for a host element.
 *
 * This is used when Formily doesn't mount the object wrapper (e.g. because
 * `onlyRenderProperties` is enabled), but we still want the wrapper props to apply.
 */
export function getXComponentProps<T extends HTMLElement = HTMLDivElement>(
  schemaLike: unknown,
): HTMLAttributes<T> {
  if (!isObjectLike(schemaLike)) return {};

  const xComponentProps = schemaLike['x-component-props'];
  if (!isObjectLike(xComponentProps)) return {};

  return xComponentProps;
}
