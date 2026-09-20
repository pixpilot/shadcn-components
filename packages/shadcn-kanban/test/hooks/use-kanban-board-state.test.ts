import type { RefObject } from 'react';
import type { KanbanColumn, KanbanItem } from '../../src';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useKanbanBoardState } from '../../src/hooks/use-kanban-board-state';

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'done', title: 'Done' },
];

const ITEMS: KanbanItem[] = [
  { id: 'a', name: 'A', columnId: 'todo' },
  { id: 'b', name: 'B', columnId: 'done' },
];

/** A plain object satisfies the ref contract and keeps the test readable. */
function dragRef(active = false): RefObject<boolean> {
  return { current: active };
}

interface Props {
  externalItems: KanbanItem[];
  columns: KanbanColumn[];
  isDragActiveRef: RefObject<boolean>;
}

function setup(props: Props) {
  return renderHook(
    (current: Props) => useKanbanBoardState<Record<string, unknown>>(current),
    {
      initialProps: props,
    },
  );
}

describe('useKanbanBoardState', () => {
  it('should start from the supplied props', () => {
    const { result } = setup({
      externalItems: ITEMS,
      columns: COLUMNS,
      isDragActiveRef: dragRef(),
    });

    expect(result.current.items).toBe(ITEMS);
    expect(result.current.itemsRef.current).toBe(ITEMS);
    expect(result.current.internalColumns).toBe(COLUMNS);
  });

  it('should mirror new items while no drag is running', () => {
    const isDragActiveRef = dragRef();
    const { result, rerender } = setup({
      externalItems: ITEMS,
      columns: COLUMNS,
      isDragActiveRef,
    });

    const nextItems: KanbanItem[] = [...ITEMS, { id: 'c', name: 'C', columnId: 'todo' }];
    rerender({ externalItems: nextItems, columns: COLUMNS, isDragActiveRef });

    expect(result.current.items).toBe(nextItems);
    expect(result.current.itemsRef.current).toBe(nextItems);
  });

  it('should ignore item prop updates while a drag is in flight', () => {
    const isDragActiveRef = dragRef(true);
    const { result, rerender } = setup({
      externalItems: ITEMS,
      columns: COLUMNS,
      isDragActiveRef,
    });

    const preview: KanbanItem[] = [{ ...ITEMS[0]!, columnId: 'done' }, ITEMS[1]!];
    act(() => {
      result.current.applyItems(preview);
    });

    /* A parent re-render that rebuilds its array must not wipe the preview. */
    rerender({
      externalItems: [...ITEMS],
      columns: COLUMNS,
      isDragActiveRef,
    });

    expect(result.current.items).toBe(preview);
    expect(result.current.itemsRef.current).toBe(preview);
  });

  it('should pick up item props again once the drag finishes', () => {
    const isDragActiveRef = dragRef(true);
    const { result, rerender } = setup({
      externalItems: ITEMS,
      columns: COLUMNS,
      isDragActiveRef,
    });

    rerender({ externalItems: [...ITEMS], columns: COLUMNS, isDragActiveRef });
    isDragActiveRef.current = false;

    const committed: KanbanItem[] = [{ ...ITEMS[0]!, columnId: 'done' }, ITEMS[1]!];
    rerender({ externalItems: committed, columns: COLUMNS, isDragActiveRef });

    expect(result.current.items).toBe(committed);
  });

  it('should mirror new columns', () => {
    const isDragActiveRef = dragRef();
    const { result, rerender } = setup({
      externalItems: ITEMS,
      columns: COLUMNS,
      isDragActiveRef,
    });

    const nextColumns: KanbanColumn[] = [...COLUMNS].reverse();
    rerender({ externalItems: ITEMS, columns: nextColumns, isDragActiveRef });

    expect(result.current.internalColumns).toBe(nextColumns);
  });

  describe('applyItems', () => {
    it('should update state and the ref together', () => {
      const { result } = setup({
        externalItems: ITEMS,
        columns: COLUMNS,
        isDragActiveRef: dragRef(),
      });

      const next: KanbanItem[] = [ITEMS[1]!, ITEMS[0]!];
      act(() => {
        result.current.applyItems(next);
      });

      expect(result.current.items).toBe(next);
      expect(result.current.itemsRef.current).toBe(next);
    });

    it('should keep a stable identity across renders', () => {
      const isDragActiveRef = dragRef();
      const { result, rerender } = setup({
        externalItems: ITEMS,
        columns: COLUMNS,
        isDragActiveRef,
      });

      const first = result.current.applyItems;
      rerender({ externalItems: ITEMS, columns: COLUMNS, isDragActiveRef });

      expect(result.current.applyItems).toBe(first);
    });
  });

  describe('setInternalColumns', () => {
    it('should replace the column list', () => {
      const { result } = setup({
        externalItems: ITEMS,
        columns: COLUMNS,
        isDragActiveRef: dragRef(),
      });

      const reordered: KanbanColumn[] = [...COLUMNS].reverse();
      act(() => {
        result.current.setInternalColumns(reordered);
      });

      expect(result.current.internalColumns).toBe(reordered);
    });
  });
});
