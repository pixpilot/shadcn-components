import type { CollisionDetection } from '@dnd-kit/core';
import type { KanbanChangeEvent, KanbanItem } from '../../src';
import type { UseKanbanDragResult } from '../../src/hooks/use-kanban-drag';

import { MouseSensor, TouchSensor } from '@dnd-kit/core';
import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  COLUMNS,
  dragEvent,
  idsIn,
  ITEMS,
  setupDrag,
  startEvent,
} from './kanban-drag-fixtures';

/** Rests the dragged card past the target's bottom edge (rows are 50 tall). */
const BELOW_TARGET = { activeTop: 51 };

/** Collision arguments where nothing can possibly be hit. */
function noCollisionArgs(activeId: string): Parameters<CollisionDetection>[0] {
  return {
    active: { id: activeId, data: { current: {} }, rect: { current: {} } },
    collisionRect: { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 },
    droppableRects: new Map(),
    droppableContainers: [],
    pointerCoordinates: null,
  } as unknown as Parameters<CollisionDetection>[0];
}

async function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('useKanbanDrag', () => {
  describe('initial state', () => {
    it('should expose the supplied items and columns', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      expect(result.current.items).toBe(ITEMS);
      expect(result.current.internalColumns).toBe(COLUMNS);
    });

    it('should start with no active drag', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      expect(result.current.activeId).toBeNull();
      expect(result.current.isDraggingColumn).toBe(false);
    });

    it('should provide sensors and a collision strategy', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      expect(result.current.sensors).toHaveLength(3);
      expect(typeof result.current.collisionDetection).toBe('function');
    });
  });

  describe('sensors', () => {
    /* `SensorOptions` is the empty base type, so the concrete constraints each
       sensor was configured with have to be asserted back in. */
    interface PointerSensorOptions {
      activationConstraint?: { delay?: number; tolerance?: number; distance?: number };
      bypassActivationConstraint?: (args: { event: { target: EventTarget } }) => boolean;
    }

    const findSensor = (sensors: UseKanbanDragResult<never>['sensors'], type: unknown) =>
      sensors.find((descriptor) => descriptor.sensor === type)?.options as
        | PointerSensorOptions
        | undefined;

    it('should arm a touch drag only after a hold, so a swipe still scrolls', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      const touchSensor = findSensor(result.current.sensors, TouchSensor);

      expect(touchSensor?.activationConstraint).toEqual({ delay: 250, tolerance: 8 });
    });

    it('should let the caller retune the hold', () => {
      const { result } = setupDrag({
        externalItems: ITEMS,
        columns: COLUMNS,
        touch: { dragActivationDelay: 400, dragActivationTolerance: 2 },
      });

      const touchSensor = findSensor(result.current.sensors, TouchSensor);

      expect(touchSensor?.activationConstraint).toEqual({ delay: 400, tolerance: 2 });
    });

    it('should start a mouse drag on distance, with no hold', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      const mouseSensor = findSensor(result.current.sensors, MouseSensor);

      expect(mouseSensor?.activationConstraint).toEqual({ distance: 5 });
    });

    it('should let an explicit drag handle bypass the hold', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      const handle = document.createElement('button');
      handle.setAttribute('data-kanban-drag-handle', '');
      const icon = document.createElement('svg');
      handle.append(icon);
      document.body.append(handle);

      const bypass = findSensor(
        result.current.sensors,
        TouchSensor,
      )?.bypassActivationConstraint;

      /* An icon inside the handle counts — that is what a finger actually hits. */
      expect(bypass?.({ event: { target: icon } })).toBe(true);
      expect(bypass?.({ event: { target: document.body } })).toBe(false);

      handle.remove();
    });
  });

  describe('handleDragStart', () => {
    it('should record the dragged card', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
      });

      expect(result.current.activeId).toBe('todo-1');
      expect(result.current.isDraggingColumn).toBe(false);
    });

    it('should flag a column drag', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('column-todo'));
      });

      expect(result.current.isDraggingColumn).toBe(true);
    });
  });

  describe('handleDragOver', () => {
    it('should preview a move into another column', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });

      expect(idsIn(result.current.items, 'doing')).toEqual(['todo-1', 'doing-1']);
      expect(idsIn(result.current.items, 'todo')).toEqual(['todo-2']);
    });

    it('should place the card after the target once it clears its bottom edge', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1', BELOW_TARGET));
      });

      expect(idsIn(result.current.items, 'doing')).toEqual(['doing-1', 'todo-1']);
    });

    it('should preview a move into an empty column', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'empty'));
      });

      expect(idsIn(result.current.items, 'empty')).toEqual(['todo-1']);
    });

    it('should move the card back when it returns to its original column', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      act(() => {
        result.current.handleDragOver(dragEvent('todo-1', 'todo-2'));
      });

      expect(idsIn(result.current.items, 'todo')).toEqual(['todo-1', 'todo-2']);
      expect(idsIn(result.current.items, 'doing')).toEqual(['doing-1']);
    });

    it('should leave same-column hovers to the sortable transforms', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'todo-2'));
      });

      expect(result.current.items).toBe(ITEMS);
    });

    it('should ignore a hover with no drop target', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', null));
      });

      expect(result.current.items).toBe(ITEMS);
    });

    it('should ignore hovers while a column is being dragged', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('column-todo'));
        result.current.handleDragOver(dragEvent('column-todo', 'doing-1'));
      });

      expect(result.current.items).toBe(ITEMS);
    });

    it('should ignore a drop target that belongs to no column', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'card-from-another-board'));
      });

      expect(result.current.items).toBe(ITEMS);
    });

    it('should ignore a hover for a card that is not on the board', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('ghost'));
        result.current.handleDragOver(dragEvent('ghost', 'doing-1'));
      });

      expect(result.current.items).toBe(ITEMS);
    });
  });

  describe('handleDragEnd', () => {
    it('should commit a same-column reorder and report it', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragEnd(dragEvent('todo-1', 'todo-2', BELOW_TARGET));
      });

      expect(idsIn(result.current.items, 'todo')).toEqual(['todo-2', 'todo-1']);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0]?.[0]).toMatchObject({
        previousColumnId: 'todo',
        nextColumnId: 'todo',
      });
    });

    it('should commit the preview verbatim when the drop reports the dragged card', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      /* Once the preview lands, the pointer rests on the moved card itself. */
      act(() => {
        result.current.handleDragEnd(dragEvent('todo-1', 'todo-1'));
      });

      const event = onChange.mock.calls[0]?.[0];
      expect(event?.previousColumnId).toBe('todo');
      expect(event?.nextColumnId).toBe('doing');
      expect(idsIn(event?.items ?? [], 'doing')).toEqual(['todo-1', 'doing-1']);
    });

    it('should reorder against the target when the drop still reports a sibling', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      /*
       * The preview put the card above `doing-1`; a drop still pointing at
       * `doing-1` means the sortable transforms have since shifted it past
       * that card, so the commit follows the transforms rather than the
       * earlier preview.
       */
      act(() => {
        result.current.handleDragEnd(dragEvent('todo-1', 'doing-1'));
      });

      const event = onChange.mock.calls[0]?.[0];
      expect(event?.nextColumnId).toBe('doing');
      expect(idsIn(event?.items ?? [], 'doing')).toEqual(['doing-1', 'todo-1']);
    });

    it('should apply a cross-column drop that drag-over never previewed', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      /* Keyboard drags jump straight to the drop without hover events. */
      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragEnd(dragEvent('todo-1', 'empty'));
      });

      expect(idsIn(result.current.items, 'empty')).toEqual(['todo-1']);
      expect(onChange.mock.calls[0]?.[0].nextColumnId).toBe('empty');
    });

    it('should restore the drag-start order when the drop lands nowhere', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      act(() => {
        result.current.handleDragEnd(dragEvent('todo-1', null));
      });

      expect(result.current.items).toBe(ITEMS);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not report a drop that changed nothing', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragEnd(dragEvent('todo-1', 'todo-1'));
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not report a card that was dragged away and back', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      act(() => {
        result.current.handleDragOver(dragEvent('todo-1', 'todo-2'));
      });
      act(() => {
        result.current.handleDragEnd(dragEvent('todo-1', 'todo-1'));
      });

      expect(idsIn(result.current.items, 'todo')).toEqual(['todo-1', 'todo-2']);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should clear the active drag', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragEnd(dragEvent('todo-1', 'doing-1'));
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.isDraggingColumn).toBe(false);
    });

    it('should work without a change handler', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      expect(() => {
        act(() => {
          result.current.handleDragStart(startEvent('todo-1'));
          result.current.handleDragEnd(dragEvent('todo-1', 'doing-1'));
        });
      }).not.toThrow();
      expect(idsIn(result.current.items, 'doing')).toEqual(['todo-1', 'doing-1']);
    });

    it('should ignore a drop for a card missing from the drag-start snapshot', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('ghost'));
        result.current.handleDragEnd(dragEvent('ghost', 'doing-1'));
      });

      expect(result.current.items).toBe(ITEMS);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should ignore a drop for a card that disappeared before the drop', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const remaining: KanbanItem[] = ITEMS.filter((item) => item.id !== 'todo-1');
      const { result, rerender } = setupDrag({
        externalItems: ITEMS,
        columns: COLUMNS,
        onChange,
      });

      rerender({ externalItems: remaining, columns: COLUMNS, onChange });
      act(() => {
        result.current.handleDragEnd(dragEvent('todo-1', 'doing-1'));
      });

      expect(result.current.items).toBe(remaining);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('after a card changes column', () => {
    it('should hold onto the dragged card while the layout reflows', () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });

      /* The columns have resized under the pointer, so this frame finds nothing. */
      expect(result.current.collisionDetection(noCollisionArgs('todo-1'))).toEqual([
        { id: 'todo-1' },
      ]);
    });

    it('should stop holding on once the next frame arrives', async () => {
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      await act(async () => {
        await nextFrame();
      });

      expect(result.current.collisionDetection(noCollisionArgs('todo-1'))).toEqual([]);
    });
  });

  describe('handleDragCancel', () => {
    it('should restore the drag-start order and clear the drag', () => {
      const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
      const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS, onChange });

      act(() => {
        result.current.handleDragStart(startEvent('todo-1'));
        result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
      });
      act(() => {
        result.current.handleDragCancel();
      });

      expect(result.current.items).toBe(ITEMS);
      expect(result.current.activeId).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
