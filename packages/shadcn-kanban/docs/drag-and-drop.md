# Drag and drop

The board follows dnd-kit's [multiple containers](https://github.com/clauderic/dnd-kit)
pattern. `useKanbanDrag` is the top-level state machine; it delegates to a card
handler and a column handler and owns the state both share.

## Two id spaces

A column is registered with dnd-kit **twice**:

- as a **droppable**, under its raw `column.id` — the target when a card is
  dropped onto empty column space;
- as a **sortable**, under a `column-` prefixed id — so columns can be dragged
  against each other without colliding with the card id space.

`utils/column-sortable-id.ts` converts between the two, and `isColumnSortableId`
is what every handler uses to decide whether it is looking at a card drag or a
column drag.

Because of this, **a card id must never start with `column-`**.

## Event flow

```
onDragStart   snapshot items, mark drag active, record activeId
     │
     ├─ card drag ────────────────────────────────────────────────┐
     │  onDragOver   cross-column only: preview the move live      │
     │  onDragEnd    apply the drop, fire onChange if order changed│
     │                                                             │
     └─ column drag (id starts with `column-`)                     │
        onDragEnd    reorder columns, fire onColumnChange          │
                                                                   │
onDragCancel  restore the drag-start snapshot ─────────────────────┘
```

### Why cross-column moves preview but same-column ones do not

`useKanbanCardDrag.handleCardDragOver` returns early when the hovered column is
the card's current column:

```ts
/* Same-column hovers are dnd-kit's job; previewing them would fight it. */
if (activeItem.columnId === overColumnId) return;
```

Within a column, dnd-kit's sortable transforms already animate the gap. Moving
the item in state as well would change the DOM under dnd-kit mid-drag and fight
its own animation. Cross-column moves get no such treatment from dnd-kit, so the
board previews those itself and commits everything on drop.

## Controlled props during a drag

`useKanbanBoardState` mirrors `items` into local state so previews can render
before the parent commits them. It deliberately **ignores prop updates while a
drag is in flight**:

```ts
React.useEffect(() => {
  if (isDragActiveRef.current) return;
  applyItems(externalItems);
}, [externalItems, applyItems, isDragActiveRef]);
```

Without this, a parent that rebuilds its `items` array on every render (a
`useMemo` over a filtered list, say) would wipe the in-flight preview on the
first re-render after `onDragOver`. Prop changes are picked up by the sync that
follows the drop.

The practical consequence for consumers: an optimistic update fired from
`onChange` is safe, because the drag has already ended by then.

## Collision detection

`useKanbanCollisionDetection` layers three dnd-kit strategies:

1. **Column drags** use `closestCenter` against columns only.
2. **Card drags** use `pointerWithin` first.
3. `rectIntersection` is the fallback — **only when there is no pointer at all**
   (a keyboard drag).

That third restriction is load-bearing, and the comment in the source explains
why: rect intersection scores the dragged card's whole rectangle against every
column, so a pointer resting in the gap between two columns can select a
neighbour whose height then changes _because of the preview move_, flipping the
winner on the next measurement. Each flip moves the card again, and the
drag-over/measure feedback loop terminates in React's "Maximum update depth
exceeded". Pointer drags therefore hold the previous target when the pointer is
over nothing.

Two more deliberate details:

- **Hovering a column resolves to the closest card inside it**, so a drop lands
  at a predictable index instead of always appending.
- **The active card stays a valid target.** Right after a cross-column move the
  pointer rests on the card that just moved; resolving to it keeps the drag
  stable — `handleCardDragOver` ignores it — instead of oscillating back toward
  the column it just left.

## Keyboard support

`utils/kanban-keyboard-coordinates.ts` supplies the `KeyboardSensor`'s
coordinate getter, so the board is fully operable without a pointer:

| Key                       | Action                                    |
| ------------------------- | ----------------------------------------- |
| <kbd>Tab</kbd>            | Move focus between cards                  |
| <kbd>Space</kbd>          | Pick up / drop the focused card           |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move to the nearest target above / below  |
| <kbd>←</kbd> <kbd>→</kbd> | Move to the nearest target left / right   |
| <kbd>Esc</kbd>            | Cancel, restoring the drag-start snapshot |

Arrow keys are **geometric, not column-scoped**: each one filters the candidate
droppables to those on the correct side of the dragged card's rect, then picks
the closest by center. In a Kanban layout that reads as "up/down within the
column, left/right across columns", but nothing enforces that.

The board cannot use dnd-kit's stock `sortableKeyboardCoordinates`, and the
reason is worth knowing before touching this file. The stock getter also targets
the dragged card's **own** column drop zone, whose left edge sits right beside
the card — so it always won the <kbd>←</kbd>/<kbd>→</kbd> comparison and arrow
keys could never leave the column. The custom getter excludes it. It also skips
the drop zone of any column that already has cards, so arrows land on a specific
card rather than the column as a whole; empty columns stay targetable, since
they are the only way into an empty column.

Keyboard drags are also the easiest way to test drag behaviour in Playwright —
see the `moveCard` action set in `KanbanBoard.stories.playwright.json`.

## Pointer activation

The `PointerSensor` uses a 5px activation distance, so a click on a card (to
open a detail view, say) is not swallowed as a drag.

## Testing notes

jsdom produces no layout boxes, so dnd-kit cannot resolve collisions there. The
existing suites mock `@dnd-kit/core`, `@dnd-kit/sortable` and `@dnd-kit/utilities`
wholesale and assert on the board's own logic. Anything genuinely geometric
belongs either in `utils/` (pure, directly testable) or in a Playwright
screenshot driven by keyboard drags.
