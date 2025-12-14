import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { PanelStateManager } from '../../utils';

import type { ArrayItemProps } from '../array-base';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { validateArrayItemFields } from '../../utils/validate-array-item-fields';
import { ArrayBase, useArrayComponents } from '../array-base';
import { ItemWrapper } from '../array-common';

interface ArrayCollapseItemProps extends ArrayItemProps {
  index: number;
  itemId: number;

  formCollapse: PanelStateManager;
  isOpen: boolean;
  onAdd?: (index: number) => void;
  isNewItem: (index: number) => boolean;
  onClick?: () => void;
}

const ArrayCollapseItemBase = React.memo((props: ArrayCollapseItemProps) => {
  const { index, itemId, formCollapse, isOpen, isNewItem, onClick } = props;
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const { ItemLabel, OperationComponents } = useArrayComponents();

  const items = Array.isArray(schema.items)
    ? (schema.items[0] ?? schema.items)
    : schema.items;

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
      <ItemWrapper index={index}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3">
          {/* Center: Expand/collapse button with item label */}
          <button
            type="button"
            onClick={() => {
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
            }}
            className="hover:no-underline flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all"
          >
            <div className="text-foreground flex items-center gap-2 font-medium">
              <ChevronDownIcon
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
              <ItemLabel schema={schema} index={index} />
            </div>
          </button>

          {/* Right: Remove button */}
          <div className="flex items-center gap-1">
            <OperationComponents schema={schema} index={index} />
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
      </ItemWrapper>
    </ArrayBase.Item>
  );
});

const ArrayCollapseItem = ArrayCollapseItemBase;

export { ArrayCollapseItem };
