import type { GeneralField } from '@formily/core';

export function filedHasError(field: GeneralField): boolean {
  const hasErrors =
    'errors' in field && Array.isArray(field.errors) && field.errors.length > 0;

  return hasErrors;
}

export function fieldsHasError(fields: GeneralField[]): boolean {
  const hasErrors = fields.some((field) => filedHasError(field));
  return hasErrors;
}
