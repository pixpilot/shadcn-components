# Column filters

Pass `filters` and each column grows a funnel button in its header. The board
tracks which filters are active per column; whether it _applies_ them is up to
you.

## The two modes

The deciding factor is whether a filter carries a `predicate`.

### Board-side — filter has a `predicate`

The board hides non-matching cards itself. Nothing else to wire up.

```tsx
const TASK_FILTERS: KanbanFilter<Task>[] = [
  {
    id: 'high-priority',
    label: 'High priority',
    predicate: (item) => item.data?.priority === 'high',
  },
];

<KanbanBoard<Task> columns={columns} items={items} filters={TASK_FILTERS} />;
```

### Parent-side — filter has no `predicate`

The board only tracks active state and reports it. You recompute `items`.

```tsx
const EXTERNAL_FILTERS: KanbanFilter<Task>[] = [
  { id: 'high-priority', label: 'High priority' }, // no predicate
];

<KanbanBoard<Task>
  columns={columns}
  items={visibleItems}
  filters={EXTERNAL_FILTERS}
  onFilterChange={(event) => {
    setActiveByColumn((prev) => ({ ...prev, [event.column.id]: event.activeFilterIds }));
  }}
/>;
```

Use this when the filtering has to happen server-side, or against data the board
cannot see.

`onFilterChange` fires in **both** modes, so you can log or persist filter usage
even when the board is doing the work.

## Combining filters

Multiple active filters within a column combine with **AND** — a card must
satisfy every active predicate to stay visible. Filters never cross column
boundaries: activating one on "To Do" leaves "Done" untouched.

## Per-column filter sets

Pass a function instead of an array to vary filters by column. Return
`undefined` or an empty array to hide the filter button entirely for that
column.

```tsx
function filtersFor(column: KanbanColumn): KanbanFilter<Task>[] | undefined {
  if (column.id === 'archive') return undefined; // no filter button
  if (column.id === 'done') return [...BASE_FILTERS, LOW_PRIORITY_FILTER];
  return BASE_FILTERS;
}

<KanbanBoard<Task> filters={filtersFor} /* … */ />;
```

The resolver runs during render, so keep it cheap and stable — an inline arrow
that rebuilds its arrays every render is fine for small sets, but hoist the
arrays if the board is large.

## Types

```ts
interface KanbanFilter<T = Record<string, unknown>> {
  id: string; // unique within its column's filter set
  label: string; // shown in the menu
  predicate?: (item: KanbanItem<T>, column: KanbanColumn) => boolean;
}

type KanbanFilters<T> =
  | KanbanFilter<T>[]
  | ((column: KanbanColumn) => KanbanFilter<T>[] | undefined);

interface KanbanFilterChangeEvent<T = Record<string, unknown>> {
  column: KanbanColumn;
  activeFilterIds: string[];
  activeFilters: KanbanFilter<T>[];
}
```

## State ownership

Active filter state lives **inside** the board (`use-kanban-filters.ts`) and is
keyed by column id. It is not a controlled prop: there is no `activeFilterIds`
input. If you need filter state to survive unmount or come from a URL, drive the
visible cards yourself with the parent-side mode and treat `onFilterChange` as
the source of truth.

Filter state is keyed by column id, so it persists across column reordering but
resets if a column's id changes.

## Interaction with infinite scroll

Board-side predicates run against the items currently loaded — they cannot
reveal a card that has not been fetched. When you combine filters with
[infinite scroll](./infinite-scroll.md), prefer the parent-side mode and push
the filter into the same query that pages the column, so filtering and paging
agree on the same result set.

## Example

`packages/shadcn-kanban/stories/KanbanBoard.stories.tsx` has three runnable stories:
`WithColumnFilters` (board-side), `PerColumnFilters` (resolver function) and
`ExternalFilterCallback` (parent-side).
