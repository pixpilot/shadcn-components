/* eslint-disable ts/no-unsafe-assignment */
import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayBaseMixins, IArrayBaseProps } from '../array-base';
import {
  observer,
  RecursionField,
  useField,
  useFieldSchema,
  useForm,
} from '@formily/react';
import { cn } from '@internal/shadcn';
import { ChevronDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { fieldsHasError } from '../../utils';
import { getDefaultValue } from '../../utils/get-default-value';
import { validateArrayItemFields } from '../../utils/validate-array-item-fields';
import { ArrayBase } from '../array-base';

type ComposedArrayItemsAccordion = React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps>
> &
  ArrayBaseMixins;

/**
 * ArrayItemsAccordion component - displays array items in an accordion with inline editing
 * Each item shows:
 * - Accordion header with item label and controls (move up/down, remove)
 * - Accordion content with editable form fields
 */
const ArrayItemsAccordionComponent = observer(
  (
    props: React.PropsWithChildren<
      React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps
    >,
  ) => {
    const field = useField<FormilyArrayField>();
    const schema = useFieldSchema();
    const form = useForm();
    const dataSource = Array.isArray(field.value) ? field.value : [];
    const [addingTempIndex, setAddingTempIndex] = React.useState<number | null>(null);
    const [openItems, setOpenItems] = useState<string[]>([]);
    const {
      onAdd,
      onRemove,
      onMoveDown,
      onMoveUp,
      onEdit,
      className,
      children,
      ...rest
    } = props;

    if (schema == null) throw new Error('Cannot find schema object');

    const handleEdit = (index: number) => {
      onEdit?.(index);
    };

    const handleAddNew = () => {
      // Add a temporary item to the array
      const tempIndex = field.value?.length ?? 0;
      setAddingTempIndex(tempIndex);
      const defaultValue = getDefaultValue(undefined, schema);
      field.push?.(defaultValue).catch(console.error);
      // Open the new item's accordion
      setOpenItems([...openItems, `item-${tempIndex}`]);
    };

    const items = Array.isArray(schema.items)
      ? (schema.items[0] ?? schema.items)
      : schema.items;

    return (
      <ArrayBase
        onAdd={onAdd}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onEdit={handleEdit}
      >
        <div {...rest} className={cn('space-y-2', className)}>
          <div className="space-y-2">
            {dataSource.map((_item, index) => {
              const isTempItem =
                addingTempIndex !== null &&
                addingTempIndex !== undefined &&
                index === addingTempIndex;
              const itemId = `item-${index}`;
              const isOpen = openItems.includes(itemId);

              // Check if this item has validation errors
              const hasErrors = fieldsHasError(
                form.query(`${field.address.toString()}.${index}.*`).map((f) => f),
              );

              return (
                <ArrayBase.Item
                  key={index}
                  index={index}
                  record={() => field.value?.[index] as unknown}
                >
                  <div
                    className={cn(
                      'border-input bg-card rounded-md border',
                      hasErrors && 'border-destructive border-2',
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 px-3">
                      {/* Left: Move up/down buttons */}
                      <div className="flex flex-col gap-1 py-2">
                        <ArrayBase.MoveUp className="size-7" />
                        <ArrayBase.MoveDown className="size-7" />
                      </div>

                      {/* Center: Expand/collapse button with item label */}
                      <button
                        type="button"
                        onClick={() => {
                          const isCurrentlyOpen = openItems.includes(itemId);

                          if (isCurrentlyOpen) {
                            // Validate before closing
                            validateArrayItemFields(form, field, index)
                              .then(() => {
                                // Validation passed, proceed with closing
                                setOpenItems((prev) =>
                                  prev.filter((id) => id !== itemId),
                                );

                                // If closing a temp item, mark it as saved
                                if (isTempItem) {
                                  setAddingTempIndex(null);
                                  onAdd?.(index);
                                }
                              })
                              .catch(() => {
                                // Validation failed - don't close the accordion
                                // Form will show validation errors
                              });
                          } else {
                            // Opening - no validation needed
                            setOpenItems((prev) => [...prev, itemId]);
                          }
                        }}
                        className="hover:no-underline flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all"
                      >
                        <div className="text-foreground flex items-center gap-2 font-medium">
                          <ArrayBase.Index />
                          {' Item'}
                        </div>
                        <ChevronDownIcon
                          className={cn(
                            'size-4 shrink-0 transition-transform duration-200',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      {/* Right: Remove button */}
                      <div className="flex items-center gap-1">
                        <ArrayBase.Remove className="size-8" />
                      </div>
                    </div>

                    {/* Content with form fields */}
                    {isOpen && items && (
                      <div className="border-t px-3 pb-4">
                        <div className="space-y-4 pt-4">
                          <RecursionField
                            basePath={field.address.concat(index)}
                            schema={items as Schema}
                            onlyRenderProperties
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </ArrayBase.Item>
              );
            })}
          </div>

          {/* Add button */}
          <div className="pt-2">
            <ArrayBase.Addition
              onClick={(e) => {
                e.preventDefault();
                handleAddNew();
              }}
            />
          </div>
        </div>
      </ArrayBase>
    );
  },
);

export const ArrayItemsAccordion: ComposedArrayItemsAccordion =
  ArrayItemsAccordionComponent as any;

ArrayItemsAccordion.displayName = 'ArrayItemsAccordion';

ArrayBase.mixin(ArrayItemsAccordion);

export default ArrayItemsAccordion;
