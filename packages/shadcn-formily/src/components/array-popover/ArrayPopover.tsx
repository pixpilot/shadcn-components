import type { ArrayComponentProps } from '../array-base';
import { observer } from '@formily/react';
import { cn, Popover, PopoverTrigger } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase, ArrayComponentProvider } from '../array-base';
import { ArrayItemsList, useArrayEditor, useArrayItemSchema } from '../array-common';
import { ArrayItemsEditPopover } from './Popover';

type Props = ArrayComponentProps & {
  popoverProps?: React.HTMLAttributes<HTMLDivElement>;
};

const ArrayPopoverBase = observer((props: Props) => {
  const {
    onAdd,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    autoSave: autoSaveProp,
    className,
    children,
    transformActions,
    popoverProps,
    ...rest
  } = props;

  const autoSave: boolean = autoSaveProp === true;

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
      autoSave={autoSave}
      transformActions={transformActions}
      onAdd={handleAdd}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onEdit={handleEdit}
    >
      <Popover open={activeItemManager.activeItem !== undefined} modal>
        <div {...rest} className={cn('space-y-2', className)}>
          <ArrayItemsList
            isNewItem={isNewItem}
            activeIndex={activeItemManager.activeItem}
          />

          <div className="pt-2">
            <PopoverTrigger asChild>
              <ArrayBase.Addition />
            </PopoverTrigger>
          </div>

          <ArrayItemsEditPopover
            activeItemManager={activeItemManager}
            onCancel={handleCancelClick}
            onAutoSave={handleLiveChange}
            autoSave={autoSave}
            schema={schema}
            onSave={handleSaveClick}
            {...popoverProps}
          />
        </div>
      </Popover>
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
