import type { ArrayField as FormilyArrayField } from '@formily/core';

import type { ArrayComponentProps } from '../array-base';
import { observer, useField, useFieldSchema } from '@formily/react';

import React, { useMemo } from 'react';
import { createPanelStateManager, getArrayItemInfo } from '../../utils';
import { ArrayBase, ArrayComponentProvider, useArrayComponents } from '../array-base';
import { SortableContainer } from '../array-sortable';
import { ArrayCollapseItem } from './item';

type Props = ArrayComponentProps & {
  defaultActiveKey?: Array<string | number>;
  mode?: 'accordion' | 'multiple';
};

/**
 * ArrayCollapse component - displays array items in an collapse with inline editing
 * Each item shows:
 * - Collapse header with item label and controls (move up/down, remove)
 * - Collapse content with editable form fields
 */
const ArrayItemsCollapseBase = observer((props: Props) => {
  const {
    onAdd,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    className,
    children,
    transformActions,
    defaultActiveKey,
    mode = 'multiple',
    ...otherProps
  } = props;
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const formCollapse = useMemo(() => {
    return createPanelStateManager(defaultActiveKey, mode === 'accordion');
  }, [defaultActiveKey, mode]);

  const dataSource = React.useMemo(
    // eslint-disable-next-line ts/no-unsafe-return
    () => (Array.isArray(field.value) ? field.value : []),
    [field.value],
  );

  const newItemIndex = React.useRef<number>(null);

  const handleAddNew = React.useCallback(
    (index: number) => {
      onAdd?.(index);
      newItemIndex.current = index;
    },
    [onAdd],
  );

  const isNewItem = React.useCallback((index: number) => {
    const isNew = newItemIndex.current === index;
    if (isNew) {
      newItemIndex.current = null;
    }
    return isNew;
  }, []);

  const arrayComponents = useArrayComponents();

  const { ArrayItemsContainer, AddButton } = arrayComponents;

  const itemKeys = React.useMemo(() => {
    return dataSource.map((_, index) => {
      const { itemKey } = getArrayItemInfo(field, index);
      return itemKey;
    });
  }, [dataSource, field]);

  const renderItems = () => {
    return dataSource.map((_item, index) => {
      const itemId = index;

      const { itemKey, record } = getArrayItemInfo(field, index);

      // Access the reactive property here - this will trigger re-renders
      const isOpen = formCollapse.activeKeys?.includes(itemId) ?? false;

      return (
        <ArrayCollapseItem
          key={itemKey}
          itemKey={itemKey}
          record={record}
          index={index}
          itemId={itemId}
          isOpen={isOpen}
          formCollapse={formCollapse}
          onAdd={onAdd}
          isNewItem={isNewItem}
        />
      );
    });
  };

  const handleMoveUp = React.useCallback(
    (index: number) => {
      formCollapse.swapActiveKeys(index, index - 1);
      onMoveUp?.(index);
    },
    [formCollapse, onMoveUp],
  );

  const handleMoveDown = React.useCallback(
    (index: number) => {
      formCollapse.swapActiveKeys(index, index + 1);
      onMoveDown?.(index);
    },
    [formCollapse, onMoveDown],
  );

  const fieldAddress = field.address.toString();

  return (
    <ArrayBase
      {...props}
      transformActions={transformActions}
      onAdd={handleAddNew}
      onRemove={onRemove}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onEdit={onEdit}
    >
      <ArrayItemsContainer
        {...otherProps}
        className={className}
        basePath={fieldAddress}
        schema={schema}
        hasItems={dataSource.length > 0}
      >
        <SortableContainer items={itemKeys}>{renderItems()}</SortableContainer>
        <AddButton schema={schema} />
      </ArrayItemsContainer>
    </ArrayBase>
  );
});

const ArrayItemsCollapseComponent: React.FC<Props> = (rest) => {
  return (
    <ArrayComponentProvider>
      <ArrayItemsCollapseBase {...rest} />
    </ArrayComponentProvider>
  );
};

export const ArrayCollapse = ArrayItemsCollapseComponent;

ArrayCollapse.displayName = 'ArrayCollapse';

ArrayBase.mixin(ArrayCollapse);

export default ArrayCollapse;
