import type { ArrayField, Form } from '@formily/core';
import { fieldsHasError } from './has-error';

/**
 * Validates all child fields of a specific array item asynchronously.
 * @param form - The Formily form instance
 * @param arrayField - The array field containing the item
 * @param index - The index of the array item to validate
 * @throws Error if any field has validation errors
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

  // Check if any field has errors after validation
  // Only fields with 'errors' property can have validation errors (Field, ArrayField, ObjectField)
  const hasErrors = fieldsHasError(childFields);

  if (hasErrors) {
    throw new Error('Validation failed for array item fields');
  }
}
