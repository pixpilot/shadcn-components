import type { ArrayField } from '@formily/core';
import type { ActiveItemManager } from './create-active-item-manager';
import { useField } from '@formily/react';
import React from 'react';
import { createActiveItemManager } from './create-active-item-manager';

export interface ArrayItemEditorProps {
  onAdd?: (index: number) => void;
  onEdit?: (index: number) => void;
  /**
   * When true, changes are committed to the parent array item immediately.
   * Cancel/close should NOT remove newly-added items.
   */
  autoSave?: boolean;
}

export interface AddOptions {
  mode?: 'inserted' | 'draft-only';
  method?: 'push' | 'unshift';
  initialDraftValue?: unknown;
}

export interface UseArrayEditorResult {
  activeItemManager: ActiveItemManager;
  handleEdit: (index: number) => void;
  handleAdd: (index: number, options?: AddOptions) => void;
  handleSaveClick: (itemIndex: number, nextValue: unknown) => void;
  handleLiveChange: (itemIndex: number, nextValue: unknown) => void;
  handleCancelClick: (itemIndex: number) => void;
  field: ArrayField;
  isNewItem: (index: number) => boolean;
}

function setArrayItemValue(arrayField: ArrayField, index: number, value: unknown) {
  const address = `${arrayField.address.toString()}.${index}`;

  // Interface for form with setValuesIn
  interface FormWithSetValuesIn {
    setValuesIn: (address: string, value: unknown) => void;
  }
  const form = arrayField.form as Partial<FormWithSetValuesIn> | undefined;
  if (form && typeof form.setValuesIn === 'function') {
    form.setValuesIn(address, value);
    return;
  }

  if (Array.isArray(arrayField.value)) {
    // Type assertion to avoid unsafe spread
    const arr = arrayField.value as unknown[];
    const next = [...arr];
    next[index] = value;
    // Interface for setValue
    interface FieldWithSetValue {
      setValue: (value: unknown) => void;
    }
    const field = arrayField as Partial<FieldWithSetValue>;
    if (typeof field.setValue === 'function') {
      field.setValue(next);
      return;
    }
    // Avoid direct mutation: create a shallow copy and assign
    Object.assign(arrayField, { value: next });
  }
}

export function useArrayEditor(props: ArrayItemEditorProps): UseArrayEditorResult {
  const { onAdd, onEdit, autoSave } = props;
  const field = useField<ArrayField>();

  const activeItemManager = React.useMemo(() => createActiveItemManager(), []);

  const handleEdit = (index: number) => {
    activeItemManager.setActiveItem(index, false);
    onEdit?.(index);
  };

  const handleAdd = (index: number, options?: AddOptions) => {
    const isAutoSave = autoSave === true;
    const isDraftOnly = options?.mode === 'draft-only' || !isAutoSave;

    if (isDraftOnly) {
      const DRAFT_ONLY_INDEX = -1;

      activeItemManager.setActiveItem(DRAFT_ONLY_INDEX, true, {
        newItemMode: 'draft-only',
        newItemMethod: options?.method,
        draftInitialValue: options?.initialDraftValue,
      });

      onAdd?.(index);
      return;
    }

    activeItemManager.setActiveItem(index, true, {
      newItemMode: 'inserted',
    });
    onAdd?.(index);
  };

  const handleSaveClick = (itemIndex: number, nextValue: unknown) => {
    if (activeItemManager.isNew && activeItemManager.newItemMode === 'draft-only') {
      const method = activeItemManager.newItemMethod ?? 'push';

      if (method === 'unshift') {
        field.unshift?.(nextValue).catch(console.error);
      } else {
        field.push?.(nextValue).catch(console.error);
      }

      activeItemManager.removeActiveItem(itemIndex);
      return;
    }

    setArrayItemValue(field, itemIndex, nextValue);
    activeItemManager.removeActiveItem(itemIndex);
  };

  const handleLiveChange = (itemIndex: number, nextValue: unknown) => {
    setArrayItemValue(field, itemIndex, nextValue);
  };

  const handleCancelClick = (itemIndex: number) => {
    if (
      !autoSave &&
      activeItemManager.isNewItem(itemIndex) &&
      activeItemManager.newItemMode !== 'draft-only'
    ) {
      field.remove?.(itemIndex).catch(console.error);
    }
    activeItemManager.removeActiveItem(itemIndex);
  };

  const isNewItem = React.useCallback(
    (index: number) => activeItemManager.activeItem === index && activeItemManager.isNew,
    [activeItemManager],
  );

  return {
    activeItemManager,
    handleEdit,
    handleAdd,
    handleSaveClick,
    handleLiveChange,
    handleCancelClick,
    field,
    isNewItem,
  };
}
