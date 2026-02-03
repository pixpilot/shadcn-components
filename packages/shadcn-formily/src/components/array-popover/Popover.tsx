import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer, useField } from '@formily/react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayItemDraftFields } from '../array-common/ArrayItemDraftFields';
import { ShakeStyles } from '../array-common/ShakeStyles';
import { useArrayItemDraftForm } from '../array-common/use-array-item-draft-form';
import { useArrayItemEditLabels } from '../array-common/use-array-item-edit-labels';
import { useEditHandlers } from '../array-common/use-edit-handlers';
import { useShakeAnimation } from '../array-common/use-shake-animation';

export interface ArrayItemsEditPopoverProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'autoSave' | 'children'
> {
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
  autoSave?: boolean | string;
  /**
   * Custom trigger element. If not provided, uses Edit button
   */
  children?: React.ReactNode;
  /**
   * If true, adds an overlay to cover the entire page behind the popover.
   * Default is true.
   */
  overlay?: boolean;
}

export const ArrayItemsEditPopover: React.FC<ArrayItemsEditPopoverProps> = observer(
  ({
    schema,
    onSave,
    onAutoSave,
    onCancel,
    children,
    activeItemManager,
    autoSave,
    overlay = true,
    ...rest
  }) => {
    const arrayField = useField<ArrayField>();
    const activeIndex = activeItemManager.activeItem;
    const isNewItem = activeItemManager.isNew;

    const open = activeIndex !== undefined;

    const normalizedAutoSave = autoSave !== false && autoSave !== 'false';

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
    });

    const isDirty = !normalizedAutoSave && draftForm.modified;

    const { shouldShake, triggerShake } = useShakeAnimation();
    const { handleSave, handleCancel } = useEditHandlers({
      itemIndex: activeIndex,
      draftForm,
      onSave,
      onCancel,
    });

    const handleDiscard = React.useCallback(() => {
      if (activeIndex === undefined) return;

      // In autoSave mode, new items are created immediately.
      // Users still need a way to abandon the new item.
      if (normalizedAutoSave && isNewItem) {
        arrayField.remove?.(activeIndex).catch(console.error);
      }

      handleCancel();
    }, [activeIndex, arrayField, handleCancel, isNewItem, normalizedAutoSave]);

    const validateAndClose = React.useCallback(() => {
      if (activeIndex === undefined) return;

      if (isDirty) {
        triggerShake();
        return;
      }

      Promise.resolve(draftForm.validate())
        .then(() => {
          handleCancel();
        })
        .catch(() => {
          triggerShake();
        });
    }, [activeIndex, draftForm, handleCancel, isDirty, triggerShake]);

    const handleOpenChange = React.useCallback(
      (isOpen: boolean) => {
        if (isOpen) return;
        validateAndClose();
      },
      [validateAndClose],
    );

    const { title, description } = useArrayItemEditLabels({
      schema,
      isNew: isNewItem,
      autoSave: normalizedAutoSave,
      itemIndex: activeIndex,
    });

    return (
      <Popover open={open} onOpenChange={handleOpenChange} modal={overlay}>
        {children !== undefined && <PopoverTrigger asChild>{children}</PopoverTrigger>}
        <PopoverContent
          className={shouldShake ? 'w-96 pp-shake' : 'w-96'}
          side="top"
          {...rest}
          onInteractOutside={(event) => {
            if (isDirty) {
              event.preventDefault();
              triggerShake();
              return;
            }

            // Ensure validation runs before closing (autoSave or manual-save mode).
            event.preventDefault();
            validateAndClose();
          }}
          onEscapeKeyDown={(event) => {
            if (isDirty) {
              event.preventDefault();
              triggerShake();
              return;
            }

            // Ensure validation runs before closing (autoSave or manual-save mode).
            event.preventDefault();
            validateAndClose();
          }}
        >
          <ShakeStyles />
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{title}</h4>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {activeIndex != null && (
              <ArrayItemDraftFields
                schema={schema}
                form={draftForm}
                className="space-y-4"
              />
            )}

            {!normalizedAutoSave && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}

            {normalizedAutoSave && isNewItem && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleDiscard}>
                  Discard
                </Button>
                <Button type="button" size="sm" onClick={validateAndClose}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
