import type { Schema } from '@formily/react';

import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer } from '@formily/react';
import {
  Button,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@pixpilot/shadcn-ui';
import React from 'react';
import { ShakeStyles } from '../../../../shadcn-ui/src/shake-styles/ShakeStyles';
import { useFormContext } from '../../hooks';
import { ArrayItemDraftFields } from '../array-common/ArrayItemDraftFields';
import { useArrayItemEditState } from '../array-common/use-array-item-edit-state';

export interface ArrayItemsEditDrawerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'autoSave'
> {
  schema: Schema;
  onSave: (index: number, value: unknown) => void;
  onAutoSave?: (index: number, value: unknown) => void;
  onCancel: (index: number) => void;
  activeItemManager: ActiveItemManager;

  /** Edge the drawer anchors to. Passed to the drawer root. Default `bottom`. */
  direction?: 'top' | 'bottom' | 'left' | 'right';

  /** Detach the drawer from the viewport edges (gap + full rounding). Default `false`. */
  floating?: boolean;

  /**
   * If true, changes are committed live and Save/Cancel buttons are hidden.
   * If false (default), changes only commit on Save.
   */
  autoSave?: boolean;
}

/**
 * Drawer for editing array items
 * Renders form fields based on the array item schema
 * RecursionField inherits component registry from parent SchemaField context (preserved through Radix Portal)
 */
export const EditDrawer = observer(
  ({
    schema,
    onSave,
    onAutoSave: _onAutoSave,
    onCancel,
    activeItemManager,
    className,
    autoSave,
    direction,
    ...rest
  }: ArrayItemsEditDrawerProps) => {
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
     * Validate the current item's fields before allowing the drawer to close.
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
    const { autoSave: _globalAutoSave, ...drawerSettings } = settings.dialog || {};
    const drawerContentProps = { ...drawerSettings, ...rest };

    return (
      <Drawer
        open={open}
        direction={direction}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            validateAndClose();
          }
        }}
      >
        <DrawerContent
          {...drawerContentProps}
          className={cn(
            'sm:mx-auto sm:max-w-[525px]',
            shouldShake && 'pp-shake',
            drawerContentProps.className,
            className,
          )}
          onInteractOutside={(event) => {
            drawerContentProps.onInteractOutside?.(event);
            if (event.defaultPrevented) return;

            /*
             * Always intercept outside-click events and run validateAndClose
             * so that invalid fields are caught before the drawer dismisses.
             * validateAndClose handles the isDirty shake case internally.
             */
            event.preventDefault();
            validateAndClose();
          }}
          onEscapeKeyDown={(event) => {
            drawerContentProps.onEscapeKeyDown?.(event);
            if (event.defaultPrevented) return;

            event.preventDefault();
            validateAndClose();
          }}
        >
          <ShakeStyles />
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          {/*
          RecursionField renders either in the parent form context (autoSave)
          or inside an isolated draft form (non-autoSave).
          basePath ensures fields are rendered at the correct array item address.
        */}
          {itemIndex != null && (
            <ArrayItemDraftFields
              as={DrawerBody}
              schema={schema}
              form={draftForm}
              basePath={basePath}
              isolated={isolatedForm}
              className={cn('grid gap-4 py-4')}
            />
          )}

          {!normalizedAutoSave && (
            <DrawerFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </DrawerFooter>
          )}

          {normalizedAutoSave && isNewItem && (
            <DrawerFooter>
              <Button type="button" variant="outline" onClick={handleDiscard}>
                Discard
              </Button>
              <Button type="button" onClick={validateAndClose}>
                Done
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  },
);
