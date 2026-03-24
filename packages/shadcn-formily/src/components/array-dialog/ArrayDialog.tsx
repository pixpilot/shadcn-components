import type { ArrayComponentProps } from '../array-base';
import { observer, useFieldSchema } from '@formily/react';

import React from 'react';
import { useFormContext } from '../../hooks';
import { ArrayBase, ArrayComponentProvider, useArrayComponents } from '../array-base';

import { ArrayItemsList, useArrayEditor, useArrayItemSchema } from '../array-common';
import { EditDialog } from './EditDialog';

type Props = ArrayComponentProps & { dialogProps?: React.HTMLAttributes<HTMLDivElement> };

/**
 * ArrayItems component displays array items as a simple list with controls
 * Each item shows:
 * - Left: Move up/down buttons
 * - Center: Item label (Item 1, Item 2, etc.)
 * - Right: Edit and Remove buttons
 */
const ArrayDialogBase = observer((props: Props) => {
  const schema = useFieldSchema();

  const {
    onAdd,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    className,
    transformActions,
    dialogProps,
  } = props;

  const { settings = {} } = useFormContext();
  const { autoSave: globalAutoSave } = settings.dialog || {};

  const autoSave = props.autoSave ?? globalAutoSave ?? false;

  const {
    activeItemManager,
    handleAdd,
    handleEdit,
    isNewItem,
    handleSaveClick,
    handleLiveChange,
    handleCancelClick,
  } = useArrayEditor({ onAdd, onEdit, autoSave });

  const { AddButton } = useArrayComponents();

  const items = useArrayItemSchema();

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
      <ArrayItemsList className={className} isNewItem={isNewItem}>
        <AddButton schema={schema} />
      </ArrayItemsList>
      <EditDialog
        {...dialogProps}
        onSave={handleSaveClick}
        onAutoSave={handleLiveChange}
        onCancel={handleCancelClick}
        activeItemManager={activeItemManager}
        schema={items}
        autoSave={autoSave}
      />
    </ArrayBase>
  );
});

const ArrayItemsComponent: React.FC<Props> = (rest) => {
  return (
    <ArrayComponentProvider>
      <ArrayDialogBase {...rest} />
    </ArrayComponentProvider>
  );
};

export const ArrayDialog = ArrayItemsComponent;

ArrayDialog.displayName = 'ArrayDialog';

ArrayBase.mixin(ArrayDialog);

export default ArrayDialog;
