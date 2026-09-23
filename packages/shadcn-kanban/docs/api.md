# API reference

All types are exported from `@pixpilot/shadcn-kanban`.

## `KanbanBoardProps<T>`

### Data

| Prop      | Type              | Default | Description                                                    |
| --------- | ----------------- | ------- | -------------------------------------------------------------- |
| `items`   | `KanbanItem<T>[]` | —       | **Required.** Every card, across every column.                 |
| `columns` | `KanbanColumn[]`  | —       | **Required.** Column definitions; array order is visual order. |

### Callbacks

| Prop             | Type                                          | Description                                                                       |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `onChange`       | `(event: KanbanChangeEvent<T>) => void`       | Fires after a drop that actually changed the order. Omit to make cards read-only. |
| `onColumnChange` | `(columns: KanbanColumn[]) => void`           | Fires after columns are reordered. **Omitting it disables column dragging.**      |
| `onAddColumn`    | `(title: string) => void`                     | Fires when the add-column popover is submitted. Requires `allowAddColumn`.        |
| `onFilterChange` | `(event: KanbanFilterChangeEvent<T>) => void` | Fires when a column's active filters change. See [filters.md](./filters.md).      |

### Rendering

| Prop                 | Type                                         | Default                  | Description                                                                                                  |
| -------------------- | -------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `renderItem`         | `(item, column) => ReactNode`                | card showing `item.name` | Custom card body. Memoised against `item`/`column`, so it does not re-run on every drag frame.               |
| `renderColumnHeader` | `(column, itemCount) => ReactNode`           | title + count badge      | Custom column header.                                                                                        |
| `hideColumnHeaders`  | `boolean`                                    | `false`                  | Hides headers while keeping the drop zone live.                                                              |
| `className`          | `string`                                     | —                        | Applied to the board scroller.                                                                               |
| `style`              | `CSSProperties`                              | —                        | Applied to the board scroller.                                                                               |
| `columnClassName`    | `string`                                     | —                        | Applied to every column wrapper.                                                                             |
| `itemClassName`      | `string`                                     | —                        | Applied to every card.                                                                                       |
| `getColumnProps`     | `(column) => HTMLAttributes<HTMLDivElement>` | —                        | Extra DOM props per column, for alternative layouts (e.g. CSS grid placement) without losing drag behaviour. |

### Behaviour

| Prop             | Type                                                                | Default    | Description                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columnOverflow` | `'scroll' \| 'expand'`                                              | `'scroll'` | Whether overflowing cards scroll inside the column or grow it. See [the layout contract](./README.md#layout-contract).                             |
| `allowAddColumn` | `boolean`                                                           | `false`    | Renders an "Add column" button after the last column. Needs `onAddColumn`.                                                                         |
| `filters`        | `KanbanFilter<T>[] \| ((column) => KanbanFilter<T>[] \| undefined)` | —          | See [filters.md](./filters.md).                                                                                                                    |
| `infiniteScroll` | `KanbanInfiniteScroll`                                              | —          | See [infinite-scroll.md](./infinite-scroll.md). Requires `columnOverflow: 'scroll'`.                                                               |
| `virtualization` | `KanbanVirtualization`                                              | —          | See [virtualization.md](./virtualization.md). Requires `columnOverflow: 'scroll'`.                                                                 |
| `dragDisabled`   | `boolean`                                                           | `false`    | Freezes card and column dragging for views where a drop position is meaningless (filtered, externally sorted). Cards stay mounted and interactive. |
| `touch`          | `KanbanTouchOptions`                                                | —          | Hold-to-drag tuning for touch input. See [touch-and-mobile.md](./touch-and-mobile.md).                                                             |
| `columnSnap`     | `boolean \| KanbanColumnSnapOptions`                                | `true`     | Columns swipe one at a time below `sm`. See [touch-and-mobile.md](./touch-and-mobile.md).                                                          |

---

## Types

### `KanbanItem<T>`

```ts
interface KanbanItem<T = Record<string, unknown>> {
  id: string; // unique across the whole board, not just the column
  name: string; // used by the default renderer and the drag overlay
  columnId: string; // which column it currently lives in
  data?: T; // your payload, passed through untouched
}
```

`id` must be unique board-wide — it doubles as the dnd-kit sortable id.

### `KanbanColumn`

```ts
interface KanbanColumn {
  id: string;
  title: string;
}
```

### `KanbanChangeEvent<T>`

```ts
interface KanbanChangeEvent<T = Record<string, unknown>> {
  item: KanbanItem<T>; // the card that moved, with its new columnId
  previousColumnId: string; // where it started, captured at drag start
  nextColumnId: string; // where it landed
  items: KanbanItem<T>[]; // the full array, correctly ordered
}
```

Use `items` rather than patching the moved card yourself — it already carries
the new ordering, which is what you need to persist positions.

To derive a card's neighbours in its new column (for a server that stores sparse
ordering keys):

```ts
const columnItems = event.items.filter((i) => i.columnId === event.nextColumnId);
const index = columnItems.findIndex((i) => i.id === event.item.id);
const before = columnItems[index - 1]?.id;
const after = columnItems[index + 1]?.id;
```

`onChange` does **not** fire when a drag ends without changing the order — a
pick-up-and-put-back is a no-op, checked with `itemsOrderEqual`.

### `KanbanFilter<T>` / `KanbanFilters<T>` / `KanbanFilterChangeEvent<T>`

See [filters.md](./filters.md).

### `KanbanInfiniteScroll`

See [infinite-scroll.md](./infinite-scroll.md).

### `KanbanVirtualization`

See [virtualization.md](./virtualization.md).

### `KanbanTouchOptions`

```ts
interface KanbanTouchOptions {
  dragActivationDelay?: number; // ms a finger must rest on a card   (default 250)
  dragActivationTolerance?: number; // px of movement tolerated while holding (default 8)
  pressFeedback?: boolean; // ring the card while it is held    (default true)
}
```

Touch only — mouse and keyboard activation are unaffected. See
[touch-and-mobile.md](./touch-and-mobile.md).

### `KanbanColumnSnapOptions`

```ts
interface KanbanColumnSnapOptions {
  align?: 'start' | 'center'; // where a column rests           (default 'start')
  columnWidth?: string; // any CSS width, while snapping   (default '85%')
}
```

Applies below the `sm` breakpoint only. See
[touch-and-mobile.md](./touch-and-mobile.md).

---

## Test hooks

Stable selectors the board renders, safe to target from tests and Playwright
screenshots:

| Selector                                            | Element                        |
| --------------------------------------------------- | ------------------------------ |
| `[data-testid="kanban-board"]`                      | The board scroller             |
| `[data-testid="kanban-item-<itemId>"]`              | A card                         |
| `[data-testid="kanban-column-<columnId>"]`          | A column wrapper               |
| `[data-testid="kanban-column-scroller-<columnId>"]` | A column's scrolling card list |
| `[data-testid="kanban-column-virtual-<columnId>"]`  | A virtualized column's spacer  |
| `[data-slot="infinite-scroll-sentinel"]`            | A column's load-more sentinel  |

Two state attributes are rendered as well: `data-snapping` on the board while
column snapping is enabled, and `data-pressing` on a card while a touch hold is
underway but has not armed the drag yet.
