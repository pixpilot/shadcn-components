import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';

import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer, useField } from '@formily/react';
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pixpilot/shadcn-ui';
import React from 'react';
import { ArrayItemDraftFields } from '../array-common/ArrayItemDraftFields';
import { ShakeStyles } from '../array-common/ShakeStyles';
import { useArrayItemDraftForm } from '../array-common/use-array-item-draft-form';
import { useArrayItemEditLabels } from '../array-common/use-array-item-edit-labels';
import { useEditHandlers } from '../array-common/use-edit-handlers';
import { useShakeAnimation } from '../array-common/use-shake-animation';

export interface ArrayItemsEditDialogProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'autoSave'
> {
  schema: Schema;
  onSave: (index: number, value: unknown) => void;
  onAutoSave?: (index: number, value: unknown) => void;
  onCancel: (index: number) => void;
  activeItemManager: ActiveItemManager;

  /**
   * If true, changes are committed live and Save/Cancel buttons are hidden.
   * If false (default), changes only commit on Save.
   */
  autoSave?: boolean;
}

/**
 * Dialog for editing array items
 * Renders form fields based on the array item schema
 * RecursionField inherits component registry from parent SchemaField context (preserved through Radix Portal)
 */
export const EditDialog = observer(
  ({
    schema,
    onSave,
    onAutoSave,
    onCancel,
    activeItemManager,
    autoSave,
    ...rest
  }: ArrayItemsEditDialogProps) => {
    const arrayField = useField<ArrayField>();
    const itemIndex = activeItemManager.activeItem;
    const { isNew } = activeItemManager;
    const open = itemIndex !== undefined;

    const handleDraftChange = React.useCallback(
      (nextValue: unknown) => {
        if (!autoSave) return;
        if (itemIndex === undefined) return;
        onAutoSave?.(itemIndex, nextValue);
      },
      [itemIndex, autoSave, onAutoSave],
    );

    const draftForm = useArrayItemDraftForm({
      arrayField,
      index: itemIndex,
      autoSave,
      onDraftChange: autoSave ? handleDraftChange : undefined,
    });

    const isDirty = !autoSave && draftForm.modified;

    const { shouldShake, triggerShake } = useShakeAnimation();
    const { handleSave, handleCancel } = useEditHandlers({
      itemIndex,
      draftForm,
      onSave,
      onCancel,
    });

    const { title, description } = useArrayItemEditLabels({
      schema,
      isNew,
      autoSave,
      itemIndex,
    });

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCancel();
          }
        }}
      >
        <DialogContent
          {...rest}
          className={cn('sm:max-w-[525px]', shouldShake && 'pp-shake')}
          onInteractOutside={(event) => {
            if (!isDirty) return;
            event.preventDefault();
            triggerShake();
          }}
        >
          <ShakeStyles />
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {/*
          RecursionField renders directly in the parent form context.
          Component registry from SchemaField is preserved through the Dialog portal.
          basePath ensures fields are rendered at the correct array item address.
        */}
          {itemIndex != null && (
            <ArrayItemDraftFields
              as={DialogBody}
              schema={schema}
              form={draftForm}
              className={cn('grid gap-4 py-4')}
            />
          )}

          {!autoSave && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
