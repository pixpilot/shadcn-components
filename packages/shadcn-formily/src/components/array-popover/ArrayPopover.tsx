import type { ArrayComponentProps } from '../array-base';
import { observer } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase, ArrayComponentProvider } from '../array-base';
import { ArrayItemsList, useArrayEditor, useArrayItemSchema } from '../array-common';
import { ArrayItemsEditPopover } from './Popover';

type Props = ArrayComponentProps;

const ArrayPopoverBase = observer((props: Props) => {
  const {
    onAdd,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    autoSave = true,
    className,
    children,
    transformActions,
    ...rest
  } = props;

  const {
    activeItemManager,
    handleAdd,
    isNewItem,
    handleEdit,
    handleSaveClick,
    handleLiveChange,
    handleCancelClick,
  } = useArrayEditor({ onAdd, onEdit, autoSave });

  const schema = useArrayItemSchema();

  return (
    <ArrayBase
      {...props}
      transformActions={transformActions}
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
            onAutoSave={handleLiveChange}
            autoSave={autoSave}
            schema={schema}
            onSave={handleSaveClick}
          >
            <ArrayBase.Addition />
          </ArrayItemsEditPopover>
        </div>
      </div>
    </ArrayBase>
  );
});

export const ArrayPopover: React.FC<Props> = (rest) => {
  return (
    <ArrayComponentProvider>
      <ArrayPopoverBase {...rest} />
    </ArrayComponentProvider>
  );
};

ArrayPopover.displayName = 'ArrayPopover';

ArrayBase.mixin(ArrayPopover);

export default ArrayPopover;
