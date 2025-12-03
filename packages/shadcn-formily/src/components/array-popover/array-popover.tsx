import type { Schema } from '@formily/react';
import type { ArrayComponentProps } from '../array-base';
import { observer } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase, ArrayComponentProvider } from '../array-base';
import { DEFAULT_EDITABLE_OPERATIONS } from '../array-base/constants';
import { ArrayItemsList, useArrayEditor } from '../array-common';
import { ArrayItemsEditPopover } from './popover';

type Props = ArrayComponentProps;

const ArrayPopoverBase = observer((props: Props) => {
  const { onAdd, onRemove, onMoveDown, onMoveUp, onEdit, className, children, ...rest } =
    props;

  const {
    activeItemManager,
    items,
    // field,
    handleAdd,
    isNewItem,
    handleEdit,
    handleSaveClick,
    handleCancelClick,
  } = useArrayEditor({ onAdd, onEdit });

  return (
    <ArrayBase
      onAdd={handleAdd}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onEdit={handleEdit}
    >
      <div {...rest} className={cn('space-y-2', className)}>
        <ArrayItemsList isNewItem={isNewItem} />

        <div className="pt-2">
          <ArrayItemsEditPopover
            activeItemManager={activeItemManager}
            onCancel={handleCancelClick}
            schema={items as Schema}
            onSave={handleSaveClick}
          >
            <ArrayBase.Addition />
          </ArrayItemsEditPopover>
        </div>
      </div>
    </ArrayBase>
  );
});

export const ArrayPopover: React.FC<Props> = ({
  operations = DEFAULT_EDITABLE_OPERATIONS,
  ...rest
}) => {
  return (
    <ArrayComponentProvider allowedOperationsComponentNames={operations}>
      <ArrayPopoverBase {...rest} />
    </ArrayComponentProvider>
  );
};

ArrayPopover.displayName = 'ArrayPopover';

ArrayBase.mixin(ArrayPopover);

export default ArrayPopover;
