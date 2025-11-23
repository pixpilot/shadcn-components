import type { ArrayField, Form } from '@formily/core';

/**
 * Validates all child fields of a specific array item asynchronously.
 * @param form - The Formily form instance
 * @param arrayField - The array field containing the item
 * @param index - The index of the array item to validate
 */
export async function validateArrayItemFields(
  form: Form,
  arrayField: ArrayField,
  index: number,
): Promise<void> {
  const itemPathPattern = `${arrayField.address.toString()}.${index}.*`;
  const childFields = form.query(itemPathPattern).map((field) => field);

  const validations: Promise<void>[] = [];
  for (const field of childFields) {
    if ('validate' in field) {
      validations.push(field.validate() as Promise<void>);
    }
  }
  await Promise.all(validations);
}
