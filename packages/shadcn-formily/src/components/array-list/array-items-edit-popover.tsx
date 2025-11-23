import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';

import { RecursionField, useField, useForm } from '@formily/react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@internal/shadcn';

import { useState } from 'react';

import { useArrayItemEditor } from '../../utils/use-array-item-editor';

export interface ArrayItemsEditPopoverProps {
  /**
   * The index of the item being edited, or null for new items
   */
  index: number | null;
  /**
   * The schema for the array item
   */
  schema: Schema;
  /**
   * Default value for new items
   */
  defaultValue?: unknown;
  /**
   * Callback when a new item is saved
   */
  onSave?: (value: any) => void;
  /**
   * Custom trigger element. If not provided, uses Edit button
   */
  children?: React.ReactNode;
  /**
   * Title for the popover
   */
  title?: string;
  /**
   * Callback when popover open state changes
   * Receives the open state and tempIndex (for hiding temp items)
   */
  onOpenChange?: (open: boolean, tempIndex: number | null) => void;
}

/**
 * Popover for editing array items inline
 * Renders form fields based on the array item schema
 * Validates on close - popover won't close if validation fails
 * RecursionField inherits component registry from parent SchemaField context (preserved through Radix Portal)
 */
export function ArrayItemsEditPopover({
  index,
  schema,
  defaultValue,
  onSave,
  children,
  title,
  onOpenChange: externalOnOpenChange,
}: ArrayItemsEditPopoverProps) {
  const form = useForm();
  const arrayField = useField<ArrayField>();
  const [open, setOpen] = useState(false);
  const isSavingRef = useState(() => ({ current: false }))[0];

  const { isNewItem, renderIndex, tempIndex, handleSave, handleCancel } =
    useArrayItemEditor({
      open,
      index,
      arrayField,
      form,
      defaultValue,
      onSave,
    });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isSavingRef.current) {
      // Closing - validate first (only if not already saving)
      isSavingRef.current = true;
      handleSave()
        .then((isValid) => {
          if (isValid) {
            setOpen(false);
            externalOnOpenChange?.(false, null);
          }
        })
        .catch(console.error)
        .finally(() => {
          isSavingRef.current = false;
        });
      // If validation fails, keep popover open
    } else if (isOpen) {
      setOpen(true);
      externalOnOpenChange?.(true, tempIndex);
    }
  };

  const handleCancelClick = () => {
    handleCancel();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {children !== undefined && (
        <PopoverTrigger
          asChild
          onClick={() => {
            // Open the popover when trigger is clicked
            const willOpen = !open;
            setOpen(willOpen);
            if (willOpen) {
              // Notify parent with the temp index that will be created
              externalOnOpenChange?.(true, arrayField.value?.length ?? 0);
            }
          }}
        >
          {children}
        </PopoverTrigger>
      )}
      <PopoverContent className="w-96">
        <div className="space-y-4">
          {title !== undefined && title.trim() !== '' && (
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {isNewItem ? title || 'Add New Item' : `Edit ${title || 'Item'}`}
              </h4>
              <p className="text-muted-foreground text-sm">
                {isNewItem
                  ? 'Fill in the details for the new item.'
                  : 'Make changes to the item.'}
              </p>
            </div>
          )}

          {/*
            RecursionField renders directly in the parent form context.
            Component registry from SchemaField is preserved through the Popover portal.
            basePath ensures fields are rendered at the correct array item address.
          */}
          {renderIndex !== null && (
            <div className="space-y-4">
              <RecursionField
                basePath={arrayField.address.concat(renderIndex)}
                schema={schema}
                onlyRenderProperties
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (isSavingRef.current) return;
                isSavingRef.current = true;
                handleSave()
                  .then((isValid) => {
                    if (isValid) {
                      setOpen(false);
                      externalOnOpenChange?.(false, null);
                    }
                  })
                  .catch(console.error)
                  .finally(() => {
                    isSavingRef.current = false;
                  });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
