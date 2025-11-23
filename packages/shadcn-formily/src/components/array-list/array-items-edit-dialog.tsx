import type { ArrayField } from '@formily/core';
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

import { useArrayItemEditor } from '../../utils/use-array-item-editor';

export interface ArrayItemsEditDialogProps {
  open: boolean;
  onClose: () => void;
  index: number | null;
  schema: Schema;
  defaultValue?: unknown;
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
  const arrayField = useField<ArrayField>();

  const { isNewItem, renderIndex, handleSave, handleCancel } = useArrayItemEditor({
    open,
    index,
    arrayField,
    form,
    defaultValue,
    onSave,
  });

  const handleSaveClick = () => {
    handleSave()
      .then((isValid) => {
        if (isValid) {
          onClose();
        }
      })
      .catch(console.error);
  };

  const handleCancelClick = () => {
    handleCancel();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancelClick();
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
        */}
        <div className="grid gap-4 py-4">
          {renderIndex !== null && (
            <RecursionField
              basePath={arrayField.address.concat(renderIndex)}
              schema={schema}
              onlyRenderProperties
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveClick}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
