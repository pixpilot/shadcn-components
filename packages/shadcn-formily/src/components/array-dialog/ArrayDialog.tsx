import type { Schema } from '@formily/react';

import type { ArrayComponentProps } from '../array-base';
import { observer, useFieldSchema } from '@formily/react';

import React from 'react';
import { ArrayBase, ArrayComponentProvider, useArrayComponents } from '../array-base';
import { ArrayItemsList, useArrayEditor } from '../array-common';

import { EditDialog } from './EditDialog';

type Props = ArrayComponentProps;

/**
 * ArrayItems component displays array items as a simple list with controls
 * Each item shows:
 * - Left: Move up/down buttons
 * - Center: Item label (Item 1, Item 2, etc.)
 * - Right: Edit and Remove buttons
 */
const ArrayDialogBase = observer((props: Props) => {
  const schema = useFieldSchema();

  const { onAdd, onRemove, onMoveDown, onMoveUp, onEdit, className, transformActions } =
    props;

  const { autoSave } = props;

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

  const items = Array.isArray(schema.items)
    ? (schema.items[0] ?? schema.items)
    : schema.items;

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
      <ArrayItemsList className={className} isNewItem={isNewItem}>
        <AddButton schema={schema} />
      </ArrayItemsList>
      <EditDialog
        onSave={handleSaveClick}
        onAutoSave={handleLiveChange}
        onCancel={handleCancelClick}
        activeItemManager={activeItemManager}
        schema={items as Schema}
        autoSave={autoSave}
      />
    </ArrayBase>
  );
});

const ArrayItemsCollapseComponent: React.FC<Props> = (rest) => {
  return (
    <ArrayComponentProvider>
      <ArrayDialogBase {...rest} />
    </ArrayComponentProvider>
  );
};

export const ArrayDialog = ArrayItemsCollapseComponent;

ArrayDialog.displayName = 'ArrayDialog';

ArrayBase.mixin(ArrayDialog);

export default ArrayDialog;
