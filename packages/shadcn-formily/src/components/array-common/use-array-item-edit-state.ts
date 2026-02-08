import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';

import type { ActiveItemManager } from './create-active-item-manager';
import { useField } from '@formily/react';
import React from 'react';
import { useArrayItemDraftForm } from './use-array-item-draft-form';
import { useArrayItemEditLabels } from './use-array-item-edit-labels';
import { useEditHandlers } from './use-edit-handlers';
import { useShakeAnimation } from './use-shake-animation';

export interface UseArrayItemEditStateOptions {
  schema: Schema;
  activeItemManager: ActiveItemManager;
  onSave: (index: number, value: unknown) => void;
  onCancel: (index: number) => void;
  onAutoSave?: (index: number, value: unknown) => void;
  /**
   * Supports boolean-ish string because some consumers pass values from schema props.
   */
  autoSave?: boolean | string;
}

export interface UseArrayItemEditStateResult {
  arrayField: ArrayField;
  activeIndex: number | undefined;
  isNewItem: boolean;
  open: boolean;
  normalizedAutoSave: boolean;
  draftForm: ReturnType<typeof useArrayItemDraftForm>;
  isDirty: boolean;
  title: string;
  description: string;
  shouldShake: boolean;
  triggerShake: () => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export function useArrayItemEditState({
  schema,
  activeItemManager,
  onSave,
  onCancel,
  onAutoSave,
  autoSave,
}: UseArrayItemEditStateOptions): UseArrayItemEditStateResult {
  const arrayField = useField<ArrayField>();

  const activeIndex = activeItemManager.activeItem;
  const isNewItem = activeItemManager.isNew;
  const open = activeIndex !== undefined;

  const normalizedAutoSave = autoSave === true || autoSave === 'true';

  const handleDraftChange = React.useCallback(
    (nextValue: unknown) => {
      if (!normalizedAutoSave) return;
      if (activeIndex === undefined) return;
      onAutoSave?.(activeIndex, nextValue);
    },
    [activeIndex, normalizedAutoSave, onAutoSave],
  );

  const draftForm = useArrayItemDraftForm({
    arrayField,
    index: activeIndex,
    autoSave: normalizedAutoSave,
    onDraftChange: normalizedAutoSave ? handleDraftChange : undefined,
    initialDraftValue: activeItemManager.draftInitialValue,
  });

  const isDirty = !normalizedAutoSave && draftForm.modified;

  const { shouldShake, triggerShake } = useShakeAnimation();

  const { handleSave, handleCancel } = useEditHandlers({
    itemIndex: activeIndex,
    draftForm,
    onSave,
    onCancel,
  });

  const { title, description } = useArrayItemEditLabels({
    schema,
    isNew: isNewItem,
    autoSave: normalizedAutoSave,
    itemIndex: activeIndex,
  });

  return {
    arrayField,
    activeIndex,
    isNewItem,
    open,
    normalizedAutoSave,
    draftForm,
    isDirty,
    title,
    description,
    shouldShake,
    triggerShake,
    handleSave,
    handleCancel,
  };
}
