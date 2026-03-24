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
import { useFormContext } from '../../hooks';
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
    onAutoSave: _onAutoSave,
    onCancel,
    activeItemManager,
    className,
    autoSave,
    ...rest
  }: ArrayItemsEditDialogProps) => {
    const {
      arrayField,
      activeIndex: itemIndex,
      isNewItem,
      open,
      normalizedAutoSave,
      draftForm,
      basePath,
      validationPath,
      isolatedForm,
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
      autoSave,
    });

    /**
     * Validate the current item's fields before allowing the dialog to close.
     * In non-autoSave mode a dirty (modified but unsaved) form shakes instead.
     * In autoSave mode the parent form fields are validated directly.
     */
    const validateAndClose = React.useCallback(() => {
      if (isDirty) {
        triggerShake();
        return;
      }

      Promise.resolve(draftForm.validate(validationPath))
        .then(() => {
          handleCancel();
        })
        .catch(() => {
          triggerShake();
        });
    }, [draftForm, handleCancel, isDirty, triggerShake, validationPath]);

    /**
     * In autoSave mode, newly-added items are inserted into the parent array
     * immediately. Discard removes the item so the user can abandon it.
     */
    const handleDiscard = React.useCallback(() => {
      if (itemIndex !== undefined && normalizedAutoSave && isNewItem) {
        arrayField.remove?.(itemIndex).catch(console.error);
      }
      handleCancel();
    }, [arrayField, handleCancel, isNewItem, itemIndex, normalizedAutoSave]);

    const { settings = {} } = useFormContext();
    const { autoSave: _globalAutoSave, ...dialogSettings } = settings.dialog || {};
    const dialogContentProps = { ...dialogSettings, ...rest };

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            validateAndClose();
          }
        }}
      >
        <DialogContent
          {...dialogContentProps}
          className={cn(
            'sm:max-w-[525px]',
            shouldShake && 'pp-shake',
            dialogContentProps.className,
            className,
          )}
          onInteractOutside={(event) => {
            dialogContentProps.onInteractOutside?.(event);
            if (event.defaultPrevented) return;

            /*
             * Always intercept outside-click events and run validateAndClose
             * so that invalid fields are caught before the dialog dismisses.
             * validateAndClose handles the isDirty shake case internally.
             */
            event.preventDefault();
            validateAndClose();
          }}
          onEscapeKeyDown={(event) => {
            dialogContentProps.onEscapeKeyDown?.(event);
            if (event.defaultPrevented) return;

            event.preventDefault();
            validateAndClose();
          }}
        >
          <ShakeStyles />
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {/*
          RecursionField renders either in the parent form context (autoSave)
          or inside an isolated draft form (non-autoSave).
          basePath ensures fields are rendered at the correct array item address.
        */}
          {itemIndex != null && (
            <ArrayItemDraftFields
              as={DialogBody}
              schema={schema}
              form={draftForm}
              basePath={basePath}
              isolated={isolatedForm}
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

          {normalizedAutoSave && isNewItem && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleDiscard}>
                Discard
              </Button>
              <Button type="button" onClick={validateAndClose}>
                Done
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
