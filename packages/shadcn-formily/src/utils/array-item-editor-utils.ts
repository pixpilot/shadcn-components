import type { ArrayField } from '@formily/core';
import { validateArrayItemFields } from './validate-array-item-fields';

/**
 * Validate and save the array item
 * Returns true if validation passed and item was saved
 */
export async function handleArrayChangeSave(
  arrayField: ArrayField,
  index: number,
  isNewItem: boolean,

  onSave?: (value: any) => void,
  forceUpdate?: () => void,
): Promise<boolean> {
  try {
    if (isNewItem) {
      // For new items, validate the temporary item that's already in the array
      await validateArrayItemFields(arrayField, index);

      // Validation passed, keep the item
      onSave?.(arrayField.value?.[index]);
      return true;
    }

    if (index !== null) {
      // For existing items, validate the current item
      await validateArrayItemFields(arrayField, index);

      // Validation passed
      return true;
    }
    return false;
  } catch {
    // Validation failed - errors will be displayed in the form
    // Force a re-render to show validation errors
    forceUpdate?.();
    return false;
  }
}

/**
 * Cancel editing and restore original values
 */
export function handleArrayNewItemCancel(
  arrayField: ArrayField,
  index: number,
  isNewItem: boolean,
  initialValues: unknown,
): void {
  if (isNewItem) {
    // For new items, remove the temporary item from the array
    arrayField.remove?.(index).catch(console.error);
  } else if (!isNewItem && index !== null && initialValues !== null) {
    // Restore the initial values to discard changes for existing items
    const currentValue = arrayField.value?.[index] as unknown;
    if (currentValue !== undefined) {
      // Restore the original value
      const restoredValue = JSON.parse(JSON.stringify(initialValues)) as unknown;
      // eslint-disable-next-line no-param-reassign
      arrayField.value[index] = restoredValue;
    }
  }
}
