import type { Schema } from '@formily/react';
import type { ActiveItemManager } from '../array-common/create-active-item-manager';
import { observer } from '@formily/react';

import { Button, PopoverContent } from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import React from 'react';
import { ArrayItemDraftFields } from '../array-common/ArrayItemDraftFields';
import { ShakeStyles } from '../array-common/ShakeStyles';
import { useArrayItemEditState } from '../array-common/use-array-item-edit-state';

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
   * If true, the popover behaves like a modal (closes on outside interaction).
   * Default is true.
   */
  modal?: boolean;
}

export const ArrayItemsEditPopover: React.FC<ArrayItemsEditPopoverProps> = observer(
  ({ schema, onSave, onAutoSave, onCancel, activeItemManager, autoSave, ...rest }) => {
    const {
      arrayField,
      activeIndex,
      isNewItem,
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
      onAutoSave,
      autoSave,
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

      Promise.resolve(draftForm.validate(validationPath))
        .then(() => {
          handleCancel();
        })
        .catch(() => {
          triggerShake();
        });
    }, [activeIndex, draftForm, handleCancel, isDirty, triggerShake, validationPath]);

    return (
      <PopoverContent
        className={shouldShake ? 'relative w-96 pp-shake' : 'relative w-96'}
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 size-8"
          aria-label="Close"
          onClick={validateAndClose}
        >
          <XIcon className="size-4" />
        </Button>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          {activeIndex != null && (
            <ArrayItemDraftFields
              schema={schema}
              form={draftForm}
              basePath={basePath}
              isolated={isolatedForm}
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
    );
  },
);
