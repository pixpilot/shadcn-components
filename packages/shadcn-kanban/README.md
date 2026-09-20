# @pixpilot/shadcn-kanban

A generic, controlled Kanban board with drag-and-drop powered by
[`@dnd-kit`](https://dndkit.com), built on
[`@pixpilot/shadcn-ui`](../shadcn-ui). It owns dragging, column reordering,
filtering and paging; you own the data.

## Install

```bash
pnpm add @pixpilot/shadcn-kanban
```

## Usage

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

| Document                                             | Covers                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [docs/README.md](./docs/README.md)                   | Overview, layout contract and generics                         |
| [docs/api.md](./docs/api.md)                         | Every prop, type and callback                                  |
| [docs/drag-and-drop.md](./docs/drag-and-drop.md)     | How the drag state machine works, and why it is built this way |
| [docs/filters.md](./docs/filters.md)                 | Per-column filters, board-side and parent-side                 |
| [docs/infinite-scroll.md](./docs/infinite-scroll.md) | Loading a column's items a page at a time                      |
| [docs/virtualization.md](./docs/virtualization.md)   | Mounting only the cards near a column's scroll window          |

## License

MIT
