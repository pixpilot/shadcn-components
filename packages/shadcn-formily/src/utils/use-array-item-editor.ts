import type { ArrayField, Form } from '@formily/core';
import { useEffect, useRef, useState } from 'react';
import { validateArrayItemFields } from './validate-array-item-fields';

export interface UseArrayItemEditorOptions {
  open: boolean;
  index: number | null;
  arrayField: ArrayField;
  form: Form;
  defaultValue?: any;
  onSave?: (value: any) => void;
}

export interface ArrayItemEditorResult {
  isNewItem: boolean;
  renderIndex: number | null;
  tempIndex: number | null;
  handleSave: () => Promise<boolean>;
  handleCancel: () => void;
}

/**
 * Hook to manage array item editing state (add/edit)
 * Handles temporary item creation, validation, and cleanup
 */
export function useArrayItemEditor({
  open,
  index,
  arrayField,
  form,
  defaultValue,
  onSave,
}: UseArrayItemEditorOptions): ArrayItemEditorResult {
  const initialValuesRef = useRef<unknown>(null);
  const [, forceUpdate] = useState({});
  const isNewItem = index === null;
  const tempIndexRef = useRef<number | null>(null);
  const [tempIndexState, setTempIndexState] = useState<number | null>(null);
  const hasInitializedRef = useRef(false);

  // Store initial values and add temporary item when editor opens
  useEffect(() => {
    if (open && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      if (isNewItem) {
        // For new items, add a temporary item to the array so fields can be rendered
        const tempIndex = arrayField.value?.length ?? 0;
        tempIndexRef.current = tempIndex;
        setTempIndexState(tempIndex);
        arrayField.push?.(defaultValue).catch(console.error);
        initialValuesRef.current = defaultValue;
      } else if (index !== null) {
        const currentValue = arrayField.value?.[index] as unknown;
        if (currentValue !== undefined) {
          // Deep clone the initial values to restore on cancel
          initialValuesRef.current = JSON.parse(JSON.stringify(currentValue));
        }
      }
    }

    // Reset initialization flag when editor closes
    if (!open) {
      hasInitializedRef.current = false;
      tempIndexRef.current = null;
      setTempIndexState(null);
    }
  }, [open, isNewItem, index, arrayField, defaultValue]);

  /**
   * Validate and save the item
   * Returns true if validation passed and item was saved
   */
  const handleSave = async (): Promise<boolean> => {
    try {
      if (isNewItem && tempIndexRef.current !== null) {
        // For new items, validate the temporary item that's already in the array
        const tempIndex = tempIndexRef.current;
        await validateArrayItemFields(form, arrayField, tempIndex);

        // Validation passed, keep the item
        onSave?.(arrayField.value?.[tempIndex]);
        return true;
      }

      if (index !== null) {
        // For existing items, validate the current item
        await validateArrayItemFields(form, arrayField, index);

        // Validation passed
        return true;
      }
      return false;
    } catch {
      // Validation failed - errors will be displayed in the form
      // Force a re-render to show validation errors
      forceUpdate({});
      return false;
    }
  };

  /**
   * Cancel editing and restore original values
   */
  const handleCancel = () => {
    if (isNewItem && tempIndexRef.current !== null) {
      // For new items, remove the temporary item from the array
      arrayField.remove?.(tempIndexRef.current).catch(console.error);
    } else if (!isNewItem && index !== null && initialValuesRef.current !== null) {
      // Restore the initial values to discard changes for existing items
      const currentValue = arrayField.value?.[index] as unknown;
      if (currentValue !== undefined) {
        // Restore the original value
        const restoredValue = JSON.parse(
          JSON.stringify(initialValuesRef.current),
        ) as unknown;
        // eslint-disable-next-line no-param-reassign
        arrayField.value[index] = restoredValue;
      }
    }
  };

  /**
   * Get the actual index to render (temp index for new items, actual index for existing)
   */
  const getRenderIndex = (): number | null => {
    if (isNewItem && tempIndexState !== null) {
      return tempIndexState;
    }
    return index;
  };

  return {
    isNewItem,
    renderIndex: getRenderIndex(),
    tempIndex: tempIndexState,
    handleSave,
    handleCancel,
  };
}
