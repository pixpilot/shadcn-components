import type { ArrayField } from '@formily/core';
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

// eslint-disable-next-line ts/explicit-module-boundary-types
export function useArrayEditor(props: ArrayItemEditorProps) {
  const { onAdd, onEdit, autoSave } = props;
  const field = useField<ArrayField>();

  const activeItemManager = React.useMemo(() => createActiveItemManager(), []);

  const handleEdit = (index: number) => {
    activeItemManager.setActiveItem(index, false);
    onEdit?.(index);
  };

  const handleAdd = (index: number) => {
    activeItemManager.setActiveItem(index, true);
    onAdd?.(index);
  };

  const handleSaveClick = (itemIndex: number, nextValue: unknown) => {
    setArrayItemValue(field, itemIndex, nextValue);
    activeItemManager.removeActiveItem(itemIndex);
  };

  const handleLiveChange = (itemIndex: number, nextValue: unknown) => {
    setArrayItemValue(field, itemIndex, nextValue);
  };

  const handleCancelClick = (itemIndex: number) => {
    if (!autoSave && activeItemManager.isNewItem(itemIndex)) {
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
