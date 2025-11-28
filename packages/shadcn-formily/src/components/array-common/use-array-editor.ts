import type { ArrayField } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { validateArrayItemFields } from '../../utils';
import { createActiveItemManager } from './create-active-item-manager';

export interface ArrayItemEditorProps {
  onAdd?: (index: number) => void;
  onEdit?: (index: number) => void;
}

// eslint-disable-next-line ts/explicit-module-boundary-types
export function useArrayEditor(props: ArrayItemEditorProps) {
  const { onAdd, onEdit } = props;
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const activeItemManager = React.useMemo(() => createActiveItemManager(), []);

  const handleEdit = (index: number) => {
    activeItemManager.setActiveItem(index, false);
    onEdit?.(index);
  };

  const handleAdd = (index: number) => {
    activeItemManager.setActiveItem(index, true);
    onAdd?.(index);
  };

  const handleSaveClick = (itemIndex: number) => {
    validateArrayItemFields(field, itemIndex)
      .then(() => {
        activeItemManager.removeActiveItem(itemIndex);
      })
      .catch(console.error);
  };

  const handleCancelClick = (itemIndex: number) => {
    if (activeItemManager.isNewItem(itemIndex)) {
      field.remove?.(itemIndex).catch(console.error);
    }
    activeItemManager.removeActiveItem(itemIndex);
  };

  const isNewItem = React.useCallback(
    (index: number) => activeItemManager.activeItem === index && activeItemManager.isNew,
    [activeItemManager],
  );

  const items = Array.isArray(schema.items)
    ? (schema.items[0] ?? schema.items)
    : schema.items;

  return {
    activeItemManager,
    handleEdit,
    handleAdd,
    handleSaveClick,
    handleCancelClick,
    field,
    items,
    isNewItem,
  };
}
