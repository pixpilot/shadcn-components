import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer, useField } from '@formily/react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayItemDraftFields } from '../array-common/ArrayItemDraftFields';
import { getEditDescription } from '../array-common/get-edit-description';
import { ShakeStyles } from '../array-common/ShakeStyles';
import { useArrayItemDraftForm } from '../array-common/use-array-item-draft-form';
import { useEditHandlers } from '../array-common/use-edit-handlers';
import { useShakeAnimation } from '../array-common/use-shake-animation';

export interface ArrayItemsEditPopoverProps {
  /**
   * The schema for the array item
   */
  schema: Schema;

  onSave: (index: number, value: unknown) => void;
  onCancel: (index: number) => void;
  activeItemManager: ActiveItemManager;
  onAutoSave?: (index: number, value: unknown) => void;
  /**
   * If true, changes are committed live and Save/Cancel buttons are hidden.
   * If false (default), changes only commit on Save.
   */
  autoSave?: boolean;
  /**
   * Custom trigger element. If not provided, uses Edit button
   */
  children?: React.ReactNode;
}

export const ArrayItemsEditPopover: React.FC<ArrayItemsEditPopoverProps> = observer(
  ({ schema, onSave, onAutoSave, onCancel, children, activeItemManager, autoSave }) => {
    const arrayField = useField<ArrayField>();
    const activeIndex = activeItemManager.activeItem;
    const isNewItem = activeItemManager.isNew;

    const open = activeIndex !== undefined;

    const handleDraftChange = React.useCallback(
      (nextValue: unknown) => {
        if (!autoSave) return;
        if (activeIndex === undefined) return;
        onAutoSave?.(activeIndex, nextValue);
      },
      [activeIndex, autoSave, onAutoSave],
    );

    const draftForm = useArrayItemDraftForm({
      arrayField,
      index: activeIndex,
      autoSave,
      onDraftChange: autoSave ? handleDraftChange : undefined,
    });

    const isDirty = !autoSave && draftForm.modified;

    const { shouldShake, triggerShake } = useShakeAnimation();
    const { handleSave, handleCancel } = useEditHandlers({
      itemIndex: activeIndex,
      draftForm,
      onSave,
      onCancel,
    });

    const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
        handleCancel();
      }
    };

    const description = getEditDescription(isNewItem, autoSave ?? false);

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        {children !== undefined && <PopoverTrigger asChild>{children}</PopoverTrigger>}
        <PopoverContent
          className={shouldShake ? 'w-96 pp-shake' : 'w-96'}
          side="top"
          onInteractOutside={(event) => {
            if (!isDirty) return;
            event.preventDefault();
            triggerShake();
          }}
        >
          <ShakeStyles />
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {isNewItem ? 'Add New Item' : `Edit Item`}
              </h4>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {activeIndex != null && (
              <ArrayItemDraftFields
                schema={schema}
                form={draftForm}
                className="space-y-4"
              />
            )}

            {!autoSave && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
