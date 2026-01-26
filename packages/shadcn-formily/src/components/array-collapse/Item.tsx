import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { PanelStateManager } from '../../utils';

import type { ArrayItemProps } from '../array-base';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { getXComponentProps } from '../../utils';
import { validateArrayItemFields } from '../../utils/validate-array-item-fields';
import { ArrayBase } from '../array-base';
import { ArrayItemHeaderRow, ItemWrapper, useArrayItemSchema } from '../array-common';
import { SortableItem } from '../array-sortable';

interface ArrayCollapseItemProps extends ArrayItemProps {
  index: number;
  itemId: number;
  itemKey: string | number;

  formCollapse: PanelStateManager;
  isOpen: boolean;
  onAdd?: (index: number) => void;
  isNewItem: (index: number) => boolean;
  onClick?: () => void;
}

const ArrayCollapseItemBase = React.memo((props: ArrayCollapseItemProps) => {
  const { index, itemId, itemKey, formCollapse, isOpen, isNewItem, onClick } = props;
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const items = useArrayItemSchema();

  // Get x-component-props from items schema to apply to the wrapper
  const itemWrapperProps = getXComponentProps(items);

  React.useEffect(() => {
    if (isNewItem(index)) {
      formCollapse.addActiveKey(itemId);
    }
  }, [index, isNewItem, itemId, formCollapse]);

  return (
    <ArrayBase.Item
      key={index}
      index={index}
      record={() => field.value?.[index] as unknown}
    >
      <SortableItem id={itemKey}>
        {/* Render hidden RecursionField to create field instances for the array item */}
        <div style={{ display: 'none' }}>
          <RecursionField schema={items} name={index} />
        </div>

        <ItemWrapper {...itemWrapperProps} index={index}>
          {/* Header */}
          <ArrayItemHeaderRow
            className="px-3"
            schema={schema}
            index={index}
            slots={{
              content: {
                className:
                  'hover:no-underline py-4 text-sm font-medium transition-all text-foreground',
              },
            }}
            leading={
              <ChevronDownIcon
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            }
            buttonProps={{
              onClick: () => {
                onClick?.();
                const isCurrentlyOpen = formCollapse.hasActiveKey(itemId);

                if (isCurrentlyOpen) {
                  // Validate before closing
                  validateArrayItemFields(field, index)
                    .then(() => {
                      // Validation passed, proceed with closing
                      formCollapse.removeActiveKey(itemId);
                    })
                    .catch(() => {
                      // Validation failed - don't close the collapse
                      // Form will show validation errors
                    });
                } else {
                  // Opening - no validation needed
                  formCollapse.addActiveKey(itemId);
                }
              },
            }}
          />

          {/* Content with form fields */}
          {isOpen && (
            <div className="border-t px-3 pb-4">
              <div className="space-y-4 pt-4">
                <RecursionField schema={items} name={index} />
              </div>
            </div>
          )}
        </ItemWrapper>
      </SortableItem>
    </ArrayBase.Item>
  );
});

const ArrayCollapseItem = ArrayCollapseItemBase;

export { ArrayCollapseItem };
