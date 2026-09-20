# Infinite scroll

Each column can load its cards a page at a time. The board renders an invisible
**sentinel** after a column's last card; when it scrolls into view the board
asks you for more.

```
┌─────────────────┐
│ list item 1     │
│ list item 2     │
│ ...             │
│ list item N     │
│ [sentinel div]◄─┼── observed element
└─────────────────┘
     ↑ triggers onLoadMore(column) when this scrolls into view
```

## Usage

```tsx
<KanbanBoard
  columns={columns}
  items={items}
  columnOverflow="scroll"
  infiniteScroll={{
    distance: 150,
    onLoadMore: (column) => loadNextPage(column.id),
    hasMore: (column) => loaded[column.id] < totals[column.id],
    isLoading: (column) => loadingColumnId === column.id,
    endMessage: <span className="text-muted-foreground text-xs">No more cards</span>,
  }}
/>
```

## `KanbanInfiniteScroll`

| Field              | Type                                | Default               | Description                                                                                   |
| ------------------ | ----------------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `onLoadMore`       | `(column: KanbanColumn) => void`    | —                     | **Required.** Load the next page for this column.                                             |
| `hasMore`          | `(column: KanbanColumn) => boolean` | —                     | **Required.** `false` stops the sentinel firing and shows `endMessage`.                       |
| `isLoading`        | `(column: KanbanColumn) => boolean` | `() => false`         | Suppresses repeat calls while a page is in flight.                                            |
| `distance`         | `number`                            | `200`                 | Pixels before the scroll edge at which to fire. Larger values load earlier and hide the wait. |
| `threshold`        | `number`                            | `0`                   | Fraction of the sentinel that must be visible.                                                |
| `root`             | `Element \| null`                   | the column's scroller | Rarely needed — the board wires this up for you.                                              |
| `disabled`         | `boolean`                           | `false`               | Pauses observation across every column.                                                       |
| `loadingComponent` | `ReactNode`                         | small spinner         | Shown while that column is loading.                                                           |
| `endMessage`       | `ReactNode`                         | nothing               | Shown once that column is fully loaded.                                                       |

`hasMore` and `isLoading` are **per-column resolvers**, not flat booleans. That
is what lets a consumer page each column from its own independent request.

## Only with `columnOverflow="scroll"`

An expanding column has no scroll edge to observe, so infinite scroll is not
implemented for it. Passing `infiniteScroll` alongside `columnOverflow="expand"`
logs a development-only `console.error` (once per board) and renders no
sentinel. It never throws — a mis-set prop should not take a board down in
production.

Remember the board's [layout contract](./README.md#layout-contract): in scroll
mode the board's **parent must have a bounded height**. If it does not, the
column never overflows, the sentinel sits permanently in view, and the board
will page until it runs out of data.

## Stopping

The board stops asking as soon as `hasMore(column)` returns `false`. Make sure
it can actually reach that state — deriving it from a known total, or from a
short final page:

```ts
hasMore: (column) => pages[column.id]?.hasNextPage ?? false,
```

A `hasMore` that always returns `true` will keep loading forever.

## Implementation

The IntersectionObserver machinery lives in
[`src/infinite-scroll/`](../src/infinite-scroll/), deliberately separate
from the board and free of Kanban concepts so it can be extracted into a
standalone package. The board is just one consumer.

```
infinite-scroll/
├── use-intersection-observer.ts  Generic hook, returns a ref callback
├── InfiniteScrollSentinel.tsx    The observed div + loading/end slots
└── types.ts                      IntersectionOptions, sentinel props
```

Two details worth knowing before you change either file.

### Re-observing is what keeps paging alive

If an appended page is too short to push the sentinel back out of view, the
intersection state never _changes_ — and IntersectionObserver only reports
changes. Paging would stall silently with items still pending.

The sentinel folds `hasMore` and `isLoading` into the hook's `disabled` input,
and the hook rebuilds its observer whenever that flips. Finishing a load
therefore re-observes the node and emits a fresh entry, which resumes paging.
There is a regression test for exactly this
(`use-intersection-observer.test.ts` → "re-observes when `disabled` flips back
to false").

### The observer root is the column's scroller

`KanbanColumn` composes dnd-kit's droppable ref with a `useState` setter so the
scroller element is available as the observer's `root`. A plain `useRef` would
not re-render once the node landed, and the observer would silently fall back to
measuring against the viewport — which breaks as soon as the board is not
full-height.

The sentinel is rendered inside the scroller but **outside** the
`SortableContext` id list: it is not a card and must never be a drop target.

## Server-side paging

The API is shaped for it. `hasMore`/`isLoading` being per-column means a
consumer holding one query per column can wire them straight through:

```tsx
infiniteScroll={{
  onLoadMore: (column) => queries[column.id]?.fetchNextPage(),
  hasMore: (column) => queries[column.id]?.hasNextPage ?? false,
  isLoading: (column) => queries[column.id]?.isFetchingNextPage ?? false,
}}
```

The web app's job board currently pages **client-side** — the whole active set
arrives in one request and a "page" is just a wider slice of the already
filtered and sorted column items, so `isLoading` is always `false` there. See
`apps/web/src/app/(dashboard)/dashboard/job-board/hooks/use-job-board-pagination.ts`.
Swapping in a per-column server query would not require any board change.

Two things that consumer has to handle, and any server-side replacement will
too:

- **Reset on query change.** When filters or sort change, every column restarts
  at page one; otherwise a new query inherits the previous scroll depth.
- **Make room on a drop.** A card dragged into a partially-revealed column would
  otherwise push its last visible card out of view. The job board bumps the
  destination column's count by one (`revealOne`) from its change handler.

## Example

`packages/shadcn-kanban/stories/KanbanBoard.stories.tsx` has two stories:
`InfiniteScrollColumns` (120 / 60 / 15 items across three columns, with an
artificial delay so the loading slot is visible — "Done" holds less than one
page, so it starts complete and shows the end message immediately) and
`InfiniteScrollUnsupportedOverflow` (the dev-error path).
