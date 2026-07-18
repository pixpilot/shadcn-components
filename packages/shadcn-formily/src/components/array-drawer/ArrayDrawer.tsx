import type { ArrayComponentProps } from '../array-base';
import { observer, useFieldSchema } from '@formily/react';

import React from 'react';
import { useFormContext } from '../../hooks';
import { ArrayBase, ArrayComponentProvider, useArrayComponents } from '../array-base';

import { ArrayItemsList, useArrayEditor, useArrayItemSchema } from '../array-common';
import { EditDrawer } from './EditDrawer';

type Props = ArrayComponentProps & {
  drawerProps?: React.HTMLAttributes<HTMLDivElement> & {
    /** Edge the drawer anchors to (`top | bottom | left | right`, default `bottom`). */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /** Detach the drawer from the viewport edges (gap + full rounding). Default `false`. */
    floating?: boolean;
  };
};

/**
 * ArrayDrawer component displays array items as a simple list with controls,
 * editing each item inside a drawer opened from its row.
 * Each item shows:
 * - Left: Move up/down buttons
 * - Center: Item label (Item 1, Item 2, etc.)
 * - Right: Edit and Remove buttons
 */
const ArrayDrawerBase = observer((props: Props) => {
  const schema = useFieldSchema();

  const {
    onAdd,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    className,
    transformActions,
    drawerProps,
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
      <EditDrawer
        {...drawerProps}
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

const ArrayDrawerComponent: React.FC<Props> = (rest) => {
  return (
    <ArrayComponentProvider>
      <ArrayDrawerBase {...rest} />
    </ArrayComponentProvider>
  );
};

export const ArrayDrawer = ArrayDrawerComponent;

ArrayDrawer.displayName = 'ArrayDrawer';

ArrayBase.mixin(ArrayDrawer);

export default ArrayDrawer;
