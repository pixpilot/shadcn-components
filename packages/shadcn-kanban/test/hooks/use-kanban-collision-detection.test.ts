import type {
  ClientRect,
  CollisionDetection,
  DroppableContainer,
  UniqueIdentifier,
} from '@dnd-kit/core';
import type { RefObject } from 'react';
import type { KanbanItem } from '../../src';

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useKanbanCollisionDetection } from '../../src/hooks/use-kanban-collision-detection';

type Args = Parameters<CollisionDetection>[0];

interface Droppable {
  id: string;
  rect: ClientRect;
}

function rect(left: number, top: number, width = 200, height = 40): ClientRect {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

/*
 *   todo (x=0,w=200)        doing (x=300,w=200)     empty (x=600,w=200)
 *   [active  y=0 ]          [doing-1 y=0 ]
 *   [todo-2  y=60]
 */
const DROPPABLES: Droppable[] = [
  { id: 'todo', rect: rect(0, 0, 200, 400) },
  { id: 'doing', rect: rect(300, 0, 200, 400) },
  { id: 'empty', rect: rect(600, 0, 200, 400) },
  { id: 'column-todo', rect: rect(0, 0, 200, 400) },
  { id: 'column-doing', rect: rect(300, 0, 200, 400) },
  { id: 'column-empty', rect: rect(600, 0, 200, 400) },
  { id: 'active', rect: rect(0, 0) },
  { id: 'todo-2', rect: rect(0, 60) },
  { id: 'doing-1', rect: rect(300, 0) },
];

const ITEMS: KanbanItem[] = [
  { id: 'active', name: 'Active', columnId: 'todo' },
  { id: 'todo-2', name: 'Todo 2', columnId: 'todo' },
  { id: 'doing-1', name: 'Doing 1', columnId: 'doing' },
];

const COLUMN_IDS = new Set(['todo', 'doing', 'empty']);

interface ArgsOptions {
  activeId?: string;
  pointer?: { x: number; y: number } | null;
  collisionRect?: ClientRect;
  droppables?: Droppable[];
}

function buildArgs({
  activeId = 'active',
  pointer = null,
  collisionRect = rect(0, 0),
  droppables = DROPPABLES,
}: ArgsOptions = {}): Args {
  return {
    active: { id: activeId, data: { current: {} }, rect: { current: {} } },
    collisionRect,
    droppableRects: new Map(droppables.map(({ id, rect: r }) => [id, r] as const)),
    droppableContainers: droppables.map(
      ({ id }) => ({ id, data: { current: {} } }) as unknown as DroppableContainer,
    ),
    pointerCoordinates: pointer,
  } as unknown as Args;
}

interface Refs {
  itemsRef: RefObject<KanbanItem[]>;
  lastOverIdRef: RefObject<UniqueIdentifier | null>;
  recentlyMovedToNewColumnRef: RefObject<boolean>;
}

function setup(overrides: Partial<Refs> = {}) {
  const refs: Refs = {
    itemsRef: { current: ITEMS },
    lastOverIdRef: { current: null },
    recentlyMovedToNewColumnRef: { current: false },
    ...overrides,
  };

  const { result } = renderHook(() =>
    useKanbanCollisionDetection<Record<string, unknown>>({
      columnIds: COLUMN_IDS,
      ...refs,
    }),
  );

  return { detect: result.current, refs };
}

describe('useKanbanCollisionDetection', () => {
  describe('dragging a column', () => {
    it('should only collide with other column handles', () => {
      const { detect } = setup();

      const collisions = detect(
        buildArgs({ activeId: 'column-todo', collisionRect: rect(300, 0, 200, 400) }),
      );

      expect(collisions.map(({ id }) => id)).toEqual([
        'column-doing',
        'column-todo',
        'column-empty',
      ]);
    });
  });

  describe('dragging a card', () => {
    it('should resolve to the card under the pointer', () => {
      const { detect, refs } = setup();

      const collisions = detect(buildArgs({ pointer: { x: 320, y: 20 } }));

      expect(collisions).toEqual([{ id: 'doing-1' }]);
      expect(refs.lastOverIdRef.current).toBe('doing-1');
    });

    it('should resolve a hovered column to its closest card', () => {
      const { detect } = setup();

      /* Below every card in `doing`, so only the column contains the pointer. */
      const collisions = detect(buildArgs({ pointer: { x: 320, y: 300 } }));

      expect(collisions).toEqual([{ id: 'doing-1' }]);
    });

    it('should resolve an empty column to the column itself', () => {
      const { detect } = setup();

      const collisions = detect(buildArgs({ pointer: { x: 620, y: 200 } }));

      expect(collisions).toEqual([{ id: 'empty' }]);
    });

    it('should never resolve to a column-sortable handle', () => {
      const { detect } = setup();

      const collisions = detect(buildArgs({ pointer: { x: 620, y: 200 } }));

      expect(collisions.map(({ id }) => String(id))).not.toContain('column-empty');
    });

    it('should keep the active card as a valid target', () => {
      const { detect } = setup();

      const collisions = detect(buildArgs({ pointer: { x: 20, y: 20 } }));

      expect(collisions).toEqual([{ id: 'active' }]);
    });

    it('should fall back to rectangle intersection without a pointer', () => {
      const { detect } = setup();

      const collisions = detect(buildArgs({ collisionRect: rect(310, 5) }));

      expect(collisions).toEqual([{ id: 'doing-1' }]);
    });

    it('should hold the previous target while the pointer rests between columns', () => {
      const { detect } = setup({ lastOverIdRef: { current: 'todo-2' } });

      /*
       * Pointer in the gap between `todo` and `doing`, with the dragged card
       * overlapping `doing`. Answering with `doing` here would move the card,
       * change the column heights and flip the intersection winner back.
       */
      const collisions = detect(
        buildArgs({ pointer: { x: 250, y: 20 }, collisionRect: rect(210, 0) }),
      );

      expect(collisions).toEqual([{ id: 'todo-2' }]);
    });
  });

  describe('when a frame finds no collision', () => {
    it('should reuse the previous target', () => {
      const { detect } = setup({ lastOverIdRef: { current: 'doing-1' } });

      const collisions = detect(
        buildArgs({ pointer: { x: 5000, y: 5000 }, collisionRect: rect(5000, 5000) }),
      );

      expect(collisions).toEqual([{ id: 'doing-1' }]);
    });

    it('should fall back to the dragged card right after a column switch', () => {
      const { detect, refs } = setup({ recentlyMovedToNewColumnRef: { current: true } });

      const collisions = detect(
        buildArgs({ pointer: { x: 5000, y: 5000 }, collisionRect: rect(5000, 5000) }),
      );

      expect(collisions).toEqual([{ id: 'active' }]);
      expect(refs.lastOverIdRef.current).toBe('active');
    });

    it('should report no collision when there is nothing to fall back to', () => {
      const { detect } = setup();

      const collisions = detect(
        buildArgs({ pointer: { x: 5000, y: 5000 }, collisionRect: rect(5000, 5000) }),
      );

      expect(collisions).toEqual([]);
    });
  });

  it('should keep a stable identity while its inputs do not change', () => {
    const itemsRef: RefObject<KanbanItem[]> = { current: ITEMS };
    const lastOverIdRef: RefObject<UniqueIdentifier | null> = { current: null };
    const recentlyMovedToNewColumnRef: RefObject<boolean> = { current: false };

    const { result, rerender } = renderHook(() =>
      useKanbanCollisionDetection<Record<string, unknown>>({
        columnIds: COLUMN_IDS,
        itemsRef,
        lastOverIdRef,
        recentlyMovedToNewColumnRef,
      }),
    );

    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
