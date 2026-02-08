import type { Schema } from '@formily/react';

import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer } from '@formily/react';
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
import { useArrayItemEditState } from '../array-common/use-array-item-edit-state';

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
    className,
    ...rest
  }: ArrayItemsEditDialogProps) => {
    const {
      activeIndex: itemIndex,
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
    } = useArrayItemEditState({
      schema,
      activeItemManager,
      onSave,
      onCancel,
      onAutoSave,
      autoSave,
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
          className={cn('sm:max-w-[525px]', shouldShake && 'pp-shake', className)}
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

          {!normalizedAutoSave && (
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
