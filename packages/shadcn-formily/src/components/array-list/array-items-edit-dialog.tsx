import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';

import { RecursionField, useField, useForm } from '@formily/react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/shadcn';

import { useEffect, useRef, useState } from 'react';

interface ArrayItemsEditDialogProps {
  open: boolean;
  onClose: () => void;
  index: number | null;
  schema: Schema;
  defaultValue?: any;
  onSave?: (value: any) => void;
}

/**
 * Dialog for editing array items
 * Renders form fields based on the array item schema
 * RecursionField inherits component registry from parent SchemaField context (preserved through Radix Portal)
 */
export function ArrayItemsEditDialog({
  open,
  onClose,
  index,
  schema,
  defaultValue,
  onSave,
}: ArrayItemsEditDialogProps) {
  const form = useForm();
  const arrayField = useField<FormilyArrayField>();
  const initialValuesRef = useRef<unknown>(null);
  const [, forceUpdate] = useState({});
  const isNewItem = index === null;
  const tempIndexRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  // Store initial values and add temporary item when dialog opens
  useEffect(() => {
    if (open && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      if (isNewItem) {
        // For new items, add a temporary item to the array so fields can be rendered
        const tempIndex = arrayField.value?.length ?? 0;
        tempIndexRef.current = tempIndex;
        arrayField.push?.(defaultValue).catch(console.error);
        initialValuesRef.current = defaultValue;
      } else if (index !== null) {
        const currentValue = arrayField.value?.[index] as unknown;
        if (currentValue !== undefined) {
          // Deep clone the initial values to restore on cancel
          initialValuesRef.current = JSON.parse(JSON.stringify(currentValue));
        }
      }
    }

    // Reset initialization flag when dialog closes
    if (!open) {
      hasInitializedRef.current = false;
      tempIndexRef.current = null;
    }
  }, [open, isNewItem, index, arrayField, defaultValue]);

  const handleSave = () => {
    // Wrap async function to properly handle promise
    const performValidation = async () => {
      try {
        if (isNewItem && tempIndexRef.current !== null) {
          // For new items, validate the temporary item that's already in the array
          const tempIndex = tempIndexRef.current;
          const itemPathPattern = `${arrayField.address.toString()}.${tempIndex}.*`;
          const childFields = form.query(itemPathPattern).map((field) => field);

          const validations: Promise<void>[] = [];
          for (const field of childFields) {
            if ('validate' in field) {
              validations.push(field.validate() as Promise<void>);
            }
          }
          await Promise.all(validations);

          // Validation passed, keep the item and close dialog
          onSave?.(arrayField.value?.[tempIndex]);
          onClose();
        } else if (index !== null) {
          // Get all child fields within the current array item using pattern matching
          // This will find all fields under the specific array index
          const itemPathPattern = `${arrayField.address.toString()}.${index}.*`;
          const childFields = form.query(itemPathPattern).map((field) => field);

          // Validate all child fields within this array item
          const validations: Promise<void>[] = [];
          for (const field of childFields) {
            if ('validate' in field) {
              validations.push(field.validate() as Promise<void>);
            }
          }
          await Promise.all(validations);

          // If validation passes, close the dialog
          // Values are already synchronized with the parent form via Formily reactivity
          onClose();
        }
      } catch {
        // Validation failed - errors will be displayed in the form
        // Don't close the dialog
        // Force a re-render to show validation errors
        forceUpdate({});
      }
    };

    performValidation().catch(() => {
      // Error already handled in the try-catch above
    });
  };

  const handleCancel = () => {
    if (isNewItem && tempIndexRef.current !== null) {
      // For new items, remove the temporary item from the array
      arrayField.remove?.(tempIndexRef.current).catch(console.error);
    } else if (!isNewItem && index !== null && initialValuesRef.current !== null) {
      // Restore the initial values to discard changes for existing items
      const currentValue = arrayField.value?.[index] as unknown;
      if (currentValue !== undefined) {
        // Restore the original value
        const restoredValue = JSON.parse(
          JSON.stringify(initialValuesRef.current),
        ) as unknown;
        arrayField.value[index] = restoredValue;
      }
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isNewItem ? 'Add New Item' : `Edit Item #${(index ?? 0) + 1}`}
          </DialogTitle>
          <DialogDescription>
            {isNewItem
              ? "Fill in the details for the new item. Click save when you're done."
              : "Make changes to the item. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        {/*
          RecursionField renders directly in the parent form context.
          Component registry from SchemaField is preserved through the Dialog portal.
          basePath ensures fields are rendered at the correct array item address.
          For new items, we use the temporary index stored in tempIndexRef.
        */}
        <div className="grid gap-4 py-4">
          {((isNewItem && tempIndexRef.current !== null) || index !== null) && (
            <RecursionField
              basePath={arrayField.address.concat(
                isNewItem ? tempIndexRef.current! : index,
              )}
              schema={schema}
              onlyRenderProperties
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
