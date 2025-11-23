import type { ArrayField, Form } from '@formily/core';

/**
 * Check if an array item at the specified index has any validation errors
 * @param form - The Formily form instance
 * @param arrayField - The array field containing the item
 * @param index - The index of the array item to check
 * @returns true if the item has validation errors, false otherwise
 */
export function hasArrayItemErrors(
  form: Form,
  arrayField: ArrayField,
  index: number,
): boolean {
  const itemPathPattern = `${arrayField.address.toString()}.${index}.*`;
  const childFields = form.query(itemPathPattern).map((field) => field);

  // Check if any field has errors
  return childFields.some(
    (field) =>
      'errors' in field && Array.isArray(field.errors) && field.errors.length > 0,
  );
}
