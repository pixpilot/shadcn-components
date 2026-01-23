import type { Schema } from '@formily/react';

import type { ActiveItemManager } from '../array-common';
import { observer, RecursionField } from '@formily/react';
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
import { getXComponentProps } from '../../utils';

export interface ArrayItemsEditDialogProps {
  schema: Schema;
  onSave: (index: number) => void;
  onCancel: (index: number) => void;
  activeItemManager: ActiveItemManager;
}

/**
 * Dialog for editing array items
 * Renders form fields based on the array item schema
 * RecursionField inherits component registry from parent SchemaField context (preserved through Radix Portal)
 */
export const EditDialog = observer(
  ({ schema, onSave, onCancel, activeItemManager }: ArrayItemsEditDialogProps) => {
    const itemIndex = activeItemManager.activeItem;
    const { isNew } = activeItemManager;
    const open = itemIndex !== undefined;

    const handleSaveClick = () => {
      if (itemIndex === undefined) return;
      onSave(itemIndex);
    };

    const handleCancelClick = () => {
      if (itemIndex === undefined) return;
      onCancel(itemIndex);
    };

    const itemWrapperProps = getXComponentProps(schema);
    const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

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
              {isNew ? 'Add New Item' : `Edit Item #${(itemIndex ?? 0) + 1}`}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? "Fill in the details for the new item. Click save when you're done."
                : "Make changes to the item. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>

          {/*
          RecursionField renders directly in the parent form context.
          Component registry from SchemaField is preserved through the Dialog portal.
          basePath ensures fields are rendered at the correct array item address.
        */}
          <DialogBody
            {...itemWrapperRestProps}
            className={cn('grid gap-4 py-4', itemWrapperClassName)}
          >
            {itemIndex != null && <RecursionField schema={schema} name={itemIndex} />}
          </DialogBody>

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
  },
);
