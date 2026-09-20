import type {
  ClientRect,
  DroppableContainer,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core';

import { KeyboardCode } from '@dnd-kit/core';
import { describe, expect, it, vi } from 'vitest';
import { kanbanKeyboardCoordinates } from '../../src/utils/kanban-keyboard-coordinates';

type Args = Parameters<KeyboardCoordinateGetter>[1];

interface Droppable {
  id: string;
  type: 'item' | 'column' | 'column-sortable';
  /** Only meaningful for `item` droppables. */
  columnId?: string;
  rect: ClientRect;
  disabled?: boolean;
  /** Omits the rect from the measured map, as if the node was never measured. */
  unmeasured?: boolean;
}

function rect(left: number, top: number, width = 200, height = 40): ClientRect {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

/*
 * A board with three columns: `todo` holds the dragged card plus a sibling,
 * `doing` holds one card, and `empty` holds none.
 *
 *   todo (x=0)        doing (x=300)     empty (x=600)
 *   [active  y=0 ]    [doing-1 y=0 ]
 *   [todo-2  y=60]
 */
const BOARD: Droppable[] = [
  { id: 'todo', type: 'column', rect: rect(0, 0, 200, 400) },
  { id: 'doing', type: 'column', rect: rect(300, 0, 200, 400) },
  { id: 'empty', type: 'column', rect: rect(600, 0, 200, 400) },
  { id: 'column-todo', type: 'column-sortable', rect: rect(0, 0, 200, 400) },
  { id: 'column-doing', type: 'column-sortable', rect: rect(300, 0, 200, 400) },
  { id: 'column-empty', type: 'column-sortable', rect: rect(600, 0, 200, 400) },
  { id: 'active', type: 'item', columnId: 'todo', rect: rect(0, 0) },
  { id: 'todo-2', type: 'item', columnId: 'todo', rect: rect(0, 60) },
  { id: 'doing-1', type: 'item', columnId: 'doing', rect: rect(300, 0) },
];

function toContainer({ id, type, columnId, rect: nodeRect, disabled }: Droppable) {
  return {
    id,
    disabled: disabled ?? false,
    data: {
      current: {
        type,
        ...(columnId === undefined ? {} : { item: { columnId } }),
      },
    },
    rect: { current: nodeRect },
  } as unknown as DroppableContainer;
}

interface ContextOptions {
  droppables?: Droppable[];
  activeId?: string;
  activeType?: 'item' | 'column-sortable';
  /** Rect of the thing being dragged; defaults to the active droppable's rect. */
  collisionRect?: ClientRect | null;
  noActive?: boolean;
}

function buildArgs({
  droppables = BOARD,
  activeId = 'active',
  activeType = 'item',
  collisionRect,
  noActive = false,
}: ContextOptions = {}): Args {
  /* Mirrors dnd-kit: `getEnabled()` never yields a disabled container. */
  const containers = droppables
    .filter((droppable) => droppable.disabled !== true)
    .map(toContainer);
  const droppableRects = new Map(
    droppables
      .filter((droppable) => droppable.unmeasured !== true)
      .map((droppable) => [droppable.id, droppable.rect] as const),
  );
  const activeRect =
    collisionRect === undefined
      ? (droppables.find((droppable) => droppable.id === activeId)?.rect ?? null)
      : collisionRect;

  const context = {
    active: noActive
      ? null
      : { id: activeId, data: { current: { type: activeType } }, rect: { current: {} } },
    collisionRect: activeRect,
    droppableRects,
    droppableContainers: { getEnabled: () => containers },
  };

  return {
    active: activeId,
    currentCoordinates: { x: 0, y: 0 },
    context,
  } as unknown as Args;
}

function press(code: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { code, cancelable: true });
}

describe('kanbanKeyboardCoordinates', () => {
  describe('key handling', () => {
    it('should ignore keys that are not arrows', () => {
      const event = press(KeyboardCode.Space);
      const preventDefault = vi.spyOn(event, 'preventDefault');

      expect(kanbanKeyboardCoordinates(event, buildArgs())).toBeUndefined();
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent the default scroll for arrow keys', () => {
      const event = press(KeyboardCode.Right);
      const preventDefault = vi.spyOn(event, 'preventDefault');

      kanbanKeyboardCoordinates(event, buildArgs());

      expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when nothing is being dragged', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ noActive: true }),
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined when the drag has no measured rect', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ collisionRect: null }),
      );

      expect(result).toBeUndefined();
    });
  });

  describe('dragging a card', () => {
    it('should move onto the nearest card in the column to the right', () => {
      const result = kanbanKeyboardCoordinates(press(KeyboardCode.Right), buildArgs());

      expect(result).toEqual({ x: 300, y: 0 });
    });

    it('should reach an empty column when no card lies in between', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ collisionRect: rect(300, 0) }),
      );

      expect(result).toEqual({ x: 600, y: 0 });
    });

    it('should move onto the sibling below inside its own column', () => {
      const result = kanbanKeyboardCoordinates(press(KeyboardCode.Down), buildArgs());

      expect(result).toEqual({ x: 0, y: 60 });
    });

    it('should move back up onto the sibling above', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Up),
        buildArgs({ activeId: 'todo-2' }),
      );

      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should move back onto a card in the column to the left', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Left),
        buildArgs({ activeId: 'doing-1' }),
      );

      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should never target its own column drop zone', () => {
      /* `todo` sits at the same coordinates as the card, so a bug here would
         return the column's own rect instead of the neighbouring card. */
      const result = kanbanKeyboardCoordinates(press(KeyboardCode.Right), buildArgs());

      expect(result).not.toEqual({ x: 0, y: 0 });
    });

    it('should ignore column-sortable handles', () => {
      const columnsOnly: Droppable[] = BOARD.filter(
        (droppable) => droppable.type !== 'item' || droppable.id === 'active',
      );

      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ droppables: columnsOnly }),
      );

      /* `doing` (a plain column drop zone) wins; its sortable twin is skipped. */
      expect(result).toEqual({ x: 300, y: 0 });
    });

    it('should ignore disabled droppables', () => {
      const withDisabledNeighbour = BOARD.map((droppable) =>
        droppable.id === 'doing-1' ? { ...droppable, disabled: true } : droppable,
      );

      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ droppables: withDisabledNeighbour }),
      );

      /* The disabled card is gone, so `doing` counts as empty and takes the drop
         at its own rect rather than the card's. */
      expect(result).toEqual({ x: 300, y: 0 });
      expect(BOARD.find((droppable) => droppable.id === 'doing')?.rect.left).toBe(300);
    });

    it('should ignore droppables that were never measured', () => {
      const unmeasuredNeighbour = BOARD.map((droppable) =>
        droppable.id === 'doing-1' ? { ...droppable, unmeasured: true } : droppable,
      );

      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({ droppables: unmeasuredNeighbour }),
      );

      expect(result).toEqual({ x: 600, y: 0 });
    });

    it('should return undefined when nothing lies in the pressed direction', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Left),
        buildArgs({ activeId: 'active' }),
      );

      expect(result).toBeUndefined();
    });

    it('should tolerate droppables without attached data', () => {
      const untyped = [
        ...BOARD,
        { id: 'stray', type: 'item', rect: rect(300, 200) } satisfies Droppable,
      ];

      expect(() =>
        kanbanKeyboardCoordinates(
          press(KeyboardCode.Right),
          buildArgs({ droppables: untyped }),
        ),
      ).not.toThrow();
    });
  });

  describe('dragging a column', () => {
    it('should move onto the next column handle', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Right),
        buildArgs({
          activeId: 'column-todo',
          activeType: 'column-sortable',
          collisionRect: rect(0, 0, 200, 400),
        }),
      );

      expect(result).toEqual({ x: 300, y: 0 });
    });

    it('should not target cards or column drop zones', () => {
      const result = kanbanKeyboardCoordinates(
        press(KeyboardCode.Down),
        buildArgs({
          activeId: 'column-todo',
          activeType: 'column-sortable',
          collisionRect: rect(0, 0, 200, 400),
        }),
      );

      /* Only the card at y=60 lies below, and cards are not column targets. */
      expect(result).toBeUndefined();
    });
  });
});
