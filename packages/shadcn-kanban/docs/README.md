# KanbanBoard

A generic, controlled Kanban board with drag-and-drop powered by
[`@dnd-kit`](https://dndkit.com). It owns dragging, column reordering, filtering
and paging; you own the data.

```tsx
import { KanbanBoard } from '@pixpilot/shadcn-kanban';

<KanbanBoard
  columns={[
    { id: 'todo', title: 'To Do' },
    { id: 'done', title: 'Done' },
  ]}
  items={items}
  onChange={(event) => setItems(event.items)}
/>;
```

The board is **controlled**: it renders the `items` prop and never mutates your
data. A drop produces a `KanbanChangeEvent` carrying the full reordered array —
assign `event.items` back to your state and the board settles.

## Documentation

| Document                                     | Covers                                                         |
| -------------------------------------------- | -------------------------------------------------------------- |
| [api.md](./api.md)                           | Every prop, type and callback                                  |
| [drag-and-drop.md](./drag-and-drop.md)       | How the drag state machine works, and why it is built this way |
| [filters.md](./filters.md)                   | Per-column filters, board-side and parent-side                 |
| [infinite-scroll.md](./infinite-scroll.md)   | Loading a column's items a page at a time                      |
| [virtualization.md](./virtualization.md)     | Mounting only the cards near a column's scroll window          |
| [touch-and-mobile.md](./touch-and-mobile.md) | Hold-to-drag on touch, and columns as a swipeable slider       |

## Generic over item data

`KanbanItem<T>` carries an arbitrary `data` payload, and the board is generic
over it. Pass the type argument so `renderItem` and the filter predicates are
typed:

```tsx
<KanbanBoard<Job>
  items={items} // KanbanItem<Job>[]
  columns={columns}
  renderItem={(item) => <JobCard job={item.data!} />}
/>
```

## Layout contract

The board is a horizontal flex scroller. Its height behaviour follows
`columnOverflow`:

- **`'scroll'`** (default) — the board fills its parent's height and each column
  scrolls its own cards. **The parent must have a bounded height**, otherwise
  there is no scroll edge and columns grow without limit.
- **`'expand'`** — columns grow to fit their cards and the page scrolls instead.

Both `infiniteScroll` and `virtualization` need a real scroll edge, so they are
only implemented for `'scroll'`.

## File map

```
kanban-board/
├── KanbanBoard.tsx          Entry point: composes the hooks, renders columns
├── KanbanColumn.tsx         One column: header, droppable scroller, sentinel
├── KanbanColumnCards.tsx    A column's cards, all of them
├── KanbanVirtualColumnCards.tsx  A column's cards, windowed
├── KanbanItem.tsx           One draggable card
├── KanbanDragOverlay.tsx    The floating preview that follows the cursor
├── AddColumnButton.tsx      Optional "add column" popover
├── ColumnFilterButton.tsx   Optional per-column filter menu
├── types.ts                 Public types
├── hooks/
│   ├── use-kanban-drag.ts               Top-level drag state machine
│   ├── use-kanban-board-state.ts        Mirrors controlled props into state
│   ├── use-kanban-card-drag.ts          Card moves + reordering
│   ├── use-kanban-column-reorder.ts     Column reordering
│   ├── use-kanban-collision-detection.ts Which droppable is under the cursor
│   ├── use-kanban-filters.ts            Active filter tracking
│   └── use-kanban-press-feedback.ts     Shows a touch hold before it arms
└── utils/                   Pure helpers, each unit-tested
```

Everything under `hooks/` and `utils/` is internal — import from
`@pixpilot/shadcn-kanban` (or `./kanban-board`) rather than reaching into a subpath.

## Testing

Unit tests live in `packages/shadcn-kanban/test/`. The drag and
filter suites stub `@dnd-kit/*` wholesale, since jsdom cannot produce the
layout measurements dnd-kit needs. `utils/` is tested directly and is the right
place to put logic that needs real coverage.

```bash
pnpm --filter @pixpilot/shadcn-kanban test
```

Storybook stories are in `packages/shadcn-kanban/stories/KanbanBoard.stories.tsx`, with
Playwright screenshot definitions alongside in
`KanbanBoard.stories.playwright.json`.
