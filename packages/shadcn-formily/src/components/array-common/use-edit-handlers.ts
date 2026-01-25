import type { Form } from '@formily/core';
import React from 'react';

export interface UseEditHandlersOptions {
  itemIndex: number | undefined;
  draftForm: Form;
  onSave: (index: number, value: unknown) => void;
  onCancel: (index: number) => void;
}

/**
 * Hook to provide common save and cancel handlers for edit operations
 */
export function useEditHandlers({
  itemIndex,
  draftForm,
  onSave,
  onCancel,
}: UseEditHandlersOptions): {
  handleSave: () => void;
  handleCancel: () => void;
} {
  const handleSave = React.useCallback(() => {
    if (itemIndex === undefined) return;
    Promise.resolve(draftForm.validate())
      .then(() => {
        const nextValue = (draftForm.values as { draft?: unknown }).draft;
        onSave(itemIndex, nextValue);
      })
      .catch(() => {
        // keep dialog/popover open; field-level errors will render in the draft form
      });
  }, [itemIndex, draftForm, onSave]);

  const handleCancel = React.useCallback(() => {
    if (itemIndex === undefined) return;
    onCancel(itemIndex);
  }, [itemIndex, onCancel]);

  return { handleSave, handleCancel };
}
