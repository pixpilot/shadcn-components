import type {
  ColumnOverflow,
  KanbanBoardProps,
  KanbanChangeEvent,
  KanbanColumn,
  KanbanFilter,
  KanbanFilterChangeEvent,
  KanbanItem,
} from '../src';

import React from 'react';
import { KanbanBoard } from '../src';

let columnCounter = 0;

const JSON_INDENT = 2;

/* ------------------------------------------------------------------ */
/*  Sample data                                                       */
/* ------------------------------------------------------------------ */

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const INITIAL_ITEMS: KanbanItem[] = [
  { id: '1', name: 'Research competitors', columnId: 'todo' },
  { id: '2', name: 'Write project brief', columnId: 'todo' },
  { id: '3', name: 'Design mockups', columnId: 'in-progress' },
  { id: '4', name: 'Setup CI/CD pipeline', columnId: 'in-progress' },
  { id: '5', name: 'Create landing page', columnId: 'done' },
];

const EMPTY_AND_POPULATED_COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'active', title: 'Active' },
  { id: 'review', title: 'Review' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'shipped', title: 'Shipped' },
];

const EMPTY_AND_POPULATED_ITEMS: KanbanItem[] = [
  { id: 'mixed-1', name: 'Plan interview flow', columnId: 'backlog' },
  { id: 'mixed-2', name: 'Wire dashboard states', columnId: 'backlog' },
  { id: 'mixed-3', name: 'Fix saved search sync', columnId: 'active' },
  { id: 'mixed-4', name: 'QA offer tracker', columnId: 'shipped' },
];

const HEAVY_COLUMN_ITEMS: KanbanItem[] = [
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `heavy-${i + 1}`,
    name: `Candidate follow-up ${i + 1}`,
    columnId: 'todo',
  })),
  { id: 'heavy-review', name: 'Review recruiter notes', columnId: 'in-progress' },
  { id: 'heavy-done', name: 'Archive closed role', columnId: 'done' },
];

/* ------------------------------------------------------------------ */
/*  Helper wrapper that tracks onChange events                        */
/* ------------------------------------------------------------------ */

/** Omit the large `items` array so the sidebar stays compact. */
function displayEvent(event: KanbanChangeEvent) {
  const { items: _items, ...rest } = event;
  return rest;
}

function KanbanWithChangeLog(props: KanbanBoardProps) {
  const [items, setItems] = React.useState<KanbanItem[]>(props.items);
  const [lastEvent, setLastEvent] = React.useState<KanbanChangeEvent | null>(null);

  const handleChange = (event: KanbanChangeEvent) => {
    setLastEvent(event);

    /* Use the full reordered items array from the event. */
    setItems(event.items);

    props.onChange?.(event);
  };

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 overflow-auto">
        <KanbanBoard {...props} items={items} onChange={handleChange} />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Last onChange event</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {lastEvent
            ? JSON.stringify(displayEvent(lastEvent), null, JSON_INDENT)
            : 'Drag an item to see the event.'}
        </pre>
      </div>
    </div>
  );
}

function KanbanViewportDemo(props: KanbanBoardProps) {
  const [items, setItems] = React.useState<KanbanItem[]>(props.items);

  const handleChange = (event: KanbanChangeEvent) => {
    setItems(event.items);
    props.onChange?.(event);
  };

  return (
    <div className="box-border h-screen w-full p-4">
      <div className="h-[520px] w-full">
        <KanbanBoard {...props} items={items} onChange={handleChange} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export default {
  title: 'shadcn-kanban/KanbanBoard',
  component: KanbanBoard,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    columnOverflow: {
      control: 'radio',
      options: ['scroll', 'expand'] satisfies ColumnOverflow[],
    },
  },
};

/** Default three-column board. */
export const Default = {
  render: (args: KanbanBoardProps) => <KanbanWithChangeLog {...args} />,
  args: {
    columns: COLUMNS,
    items: INITIAL_ITEMS,
  },
};

/** Board with custom item renderer. */
export const CustomItemRenderer = {
  render: (args: KanbanBoardProps) => <KanbanWithChangeLog {...args} />,
  args: {
    columns: COLUMNS,
    items: INITIAL_ITEMS,
    renderItem: (item: KanbanItem, column: KanbanColumn) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
            {item.name.charAt(0)}
          </span>
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        <span className="text-muted-foreground text-xs">Column: {column.title}</span>
      </div>
    ),
  },
};

/** Board with custom column headers. */
export const CustomColumnHeader = {
  render: (args: KanbanBoardProps) => <KanbanWithChangeLog {...args} />,
  args: {
    columns: COLUMNS,
    items: INITIAL_ITEMS,
    renderColumnHeader: (column: KanbanColumn, count: number) => (
      <div className="mb-3 flex items-center gap-2 border-b pb-2">
        <div className="bg-primary h-3 w-3 rounded-full" />
        <span className="text-sm font-bold tracking-wide uppercase">{column.title}</span>
        <span className="text-muted-foreground ml-auto text-xs">{count} items</span>
      </div>
    ),
  },
};

/** Board with an empty column to demonstrate drop targets. */
export const EmptyColumn = {
  render: (args: KanbanBoardProps) => <KanbanWithChangeLog {...args} />,
  args: {
    columns: [
      { id: 'backlog', title: 'Backlog' },
      { id: 'active', title: 'Active' },
      { id: 'review', title: 'Review' },
      { id: 'shipped', title: 'Shipped' },
    ],
    items: [
      { id: 'a', name: 'Implement auth', columnId: 'backlog' },
      { id: 'b', name: 'Add tests', columnId: 'backlog' },
      { id: 'c', name: 'Fix bug #42', columnId: 'active' },
    ],
  },
};

export const MixedEmptyAndPopulatedColumns = {
  render: (args: KanbanBoardProps) => <KanbanViewportDemo {...args} />,
  args: {
    columns: EMPTY_AND_POPULATED_COLUMNS,
    items: EMPTY_AND_POPULATED_ITEMS,
    columnOverflow: 'scroll' satisfies ColumnOverflow,
  },
};

export const ColumnOverflowScroll = {
  render: (args: KanbanBoardProps) => <KanbanViewportDemo {...args} />,
  args: {
    columns: COLUMNS,
    items: HEAVY_COLUMN_ITEMS,
    columnOverflow: 'scroll' satisfies ColumnOverflow,
  },
};

export const ColumnOverflowExpand = {
  render: (args: KanbanBoardProps) => <KanbanViewportDemo {...args} />,
  args: {
    columns: COLUMNS,
    items: HEAVY_COLUMN_ITEMS,
    columnOverflow: 'expand' satisfies ColumnOverflow,
  },
};

/** Board with allowAddColumn enabled. */

function WithAddColumnRenderer(props: KanbanBoardProps) {
  const [cols, setCols] = React.useState<KanbanColumn[]>(props.columns);
  const [items, setItems] = React.useState<KanbanItem[]>(props.items);
  const [lastEvent, setLastEvent] = React.useState<KanbanChangeEvent | null>(null);

  const handleChange = (event: KanbanChangeEvent) => {
    setLastEvent(event);
    setItems(event.items);
  };

  const handleAddColumn = (title: string) => {
    columnCounter += 1;
    setCols((prev) => [...prev, { id: `col-${Date.now()}-${columnCounter}`, title }]);
  };

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 overflow-auto">
        <KanbanBoard
          columns={cols}
          items={items}
          onChange={handleChange}
          allowAddColumn
          onAddColumn={handleAddColumn}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Columns ({cols.length})</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {JSON.stringify(cols, null, JSON_INDENT)}
        </pre>
        <div className="mt-4 mb-2 text-sm font-medium">Last onChange event</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {lastEvent
            ? JSON.stringify(displayEvent(lastEvent), null, JSON_INDENT)
            : 'Drag an item to see the event.'}
        </pre>
      </div>
    </div>
  );
}

export const WithAddColumn = {
  render: (args: KanbanBoardProps) => <WithAddColumnRenderer {...args} />,
  args: {
    columns: COLUMNS,
    items: INITIAL_ITEMS,
  },
};

/** Board with many items to test scrolling. */
export const ManyItems = {
  render: (args: KanbanBoardProps) => <KanbanWithChangeLog {...args} />,
  args: {
    columns: COLUMNS,
    items: Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      name: `Task ${i + 1}`,
      columnId: COLUMNS[i % COLUMNS.length]!.id,
    })),
  },
};

/** Board with sortable columns. */

function SortableColumnsRenderer(props: KanbanBoardProps) {
  const [cols, setCols] = React.useState<KanbanColumn[]>(props.columns);
  const [items, setItems] = React.useState<KanbanItem[]>(props.items);
  const [lastEvent, setLastEvent] = React.useState<KanbanChangeEvent | null>(null);

  const handleChange = (event: KanbanChangeEvent) => {
    setLastEvent(event);
    setItems(event.items);
  };

  const handleColumnChange = (newColumns: KanbanColumn[]) => {
    setCols(newColumns);
  };

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 overflow-auto">
        <KanbanBoard
          columns={cols}
          items={items}
          onChange={handleChange}
          onColumnChange={handleColumnChange}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Column order</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {JSON.stringify(
            cols.map((c) => c.title),
            null,
            JSON_INDENT,
          )}
        </pre>
        <div className="mt-4 mb-2 text-sm font-medium">Last onChange event</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {lastEvent
            ? JSON.stringify(displayEvent(lastEvent), null, JSON_INDENT)
            : 'Drag an item to see the event.'}
        </pre>
      </div>
    </div>
  );
}

export const SortableColumns = {
  render: (args: KanbanBoardProps) => <SortableColumnsRenderer {...args} />,
  args: {
    columns: COLUMNS,
    items: INITIAL_ITEMS,
  },
};

/* ================================================================== */
/*  Column filters                                                     */
/* ================================================================== */

/**
 * The board is generic over the shape of each item's `data`. For the filter
 * demos we attach a small `Task` payload to every card so the filter
 * predicates have something meaningful to read.
 */
type Priority = 'high' | 'medium' | 'low';

interface Task {
  priority: Priority;
  tags: string[];
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'bg-red-500/15 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

const TASK_ITEMS: KanbanItem<Task>[] = [
  {
    id: 't1',
    name: 'Fix login redirect',
    columnId: 'todo',
    data: { priority: 'high', tags: ['bug'] },
  },
  {
    id: 't2',
    name: 'Dark mode toggle',
    columnId: 'todo',
    data: { priority: 'low', tags: ['feature'] },
  },
  {
    id: 't3',
    name: 'Crash on upload',
    columnId: 'todo',
    data: { priority: 'high', tags: ['bug'] },
  },
  {
    id: 't4',
    name: 'Onboarding tour',
    columnId: 'in-progress',
    data: { priority: 'medium', tags: ['feature'] },
  },
  {
    id: 't5',
    name: 'Memory leak in worker',
    columnId: 'in-progress',
    data: { priority: 'high', tags: ['bug'] },
  },
  {
    id: 't6',
    name: 'Export to CSV',
    columnId: 'done',
    data: { priority: 'medium', tags: ['feature'] },
  },
  {
    id: 't7',
    name: 'Typo in footer',
    columnId: 'done',
    data: { priority: 'low', tags: ['bug'] },
  },
];

/**
 * A flat list of filters. Because each filter defines a `predicate`, the
 * board hides non-matching cards on its own — no extra wiring required.
 * The same list is shared by every column.
 */
const TASK_FILTERS: KanbanFilter<Task>[] = [
  {
    id: 'high-priority',
    label: 'High priority',
    predicate: (item) => item.data?.priority === 'high',
  },
  {
    id: 'tag-bug',
    label: 'Tagged: bug',
    predicate: (item) => item.data?.tags.includes('bug') ?? false,
  },
  {
    id: 'tag-feature',
    label: 'Tagged: feature',
    predicate: (item) => item.data?.tags.includes('feature') ?? false,
  },
];

/** Card renderer that surfaces the priority + tags so filters are visible. */
function renderTaskCard(item: KanbanItem<Task>) {
  const priority = item.data?.priority ?? 'low';
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{item.name}</span>
      <div className="flex flex-wrap items-center gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_COLOR[priority]}`}
        >
          {priority}
        </span>
        {item.data?.tags.map((tag) => (
          <span
            key={tag}
            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Filtering handled entirely by the board.
 *
 * Pass `filters` as a prop where each filter has a `predicate`; the board
 * hides cards that don't match the active filters in that column. The
 * optional `onFilterChange` callback still fires so you can react (analytics,
 * persistence, …) without owning the filtering logic.
 *
 * Multiple active filters combine with AND — a card must satisfy every active
 * filter in its column to stay visible.
 */
function PredicateFilterRenderer() {
  const [items, setItems] = React.useState<KanbanItem<Task>[]>(TASK_ITEMS);
  const [lastFilterEvent, setLastFilterEvent] =
    React.useState<KanbanFilterChangeEvent<Task> | null>(null);

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 overflow-auto">
        <KanbanBoard<Task>
          columns={COLUMNS}
          items={items}
          onChange={(event) => setItems(event.items)}
          renderItem={renderTaskCard}
          filters={TASK_FILTERS}
          onFilterChange={(event) => setLastFilterEvent(event)}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Last onFilterChange event</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {lastFilterEvent
            ? JSON.stringify(
                {
                  column: lastFilterEvent.column.title,
                  activeFilterIds: lastFilterEvent.activeFilterIds,
                  activeFilters: lastFilterEvent.activeFilters.map((f) => f.label),
                },
                null,
                JSON_INDENT,
              )
            : 'Open a column filter (the funnel icon) and pick a filter.'}
        </pre>
      </div>
    </div>
  );
}

export const WithColumnFilters = {
  render: () => <PredicateFilterRenderer />,
};

/**
 * Different filters per column.
 *
 * Pass `filters` as a function to tailor the available filters to each
 * column. Here the "Done" column gets an extra "Low priority" filter the
 * other columns don't have, and you could just as easily return `undefined`
 * for a column to hide its filter button entirely.
 */
function perColumnFilters(column: KanbanColumn): KanbanFilter<Task>[] {
  const base = TASK_FILTERS;
  if (column.id === 'done') {
    return [
      ...base,
      {
        id: 'low-priority',
        label: 'Low priority',
        predicate: (item) => item.data?.priority === 'low',
      },
    ];
  }
  return base;
}

function PerColumnFilterRenderer() {
  const [items, setItems] = React.useState<KanbanItem<Task>[]>(TASK_ITEMS);

  return (
    <div className="h-screen w-full overflow-auto p-4">
      <KanbanBoard<Task>
        columns={COLUMNS}
        items={items}
        onChange={(event) => setItems(event.items)}
        renderItem={renderTaskCard}
        filters={perColumnFilters}
      />
    </div>
  );
}

export const PerColumnFilters = {
  render: () => <PerColumnFilterRenderer />,
};

/**
 * Externally controlled filtering.
 *
 * The filters here have **no** `predicate`, so the board does not touch the
 * cards — it only tracks which filters are active and reports them through
 * `onFilterChange`. The parent owns the data and decides what to show by
 * recomputing the `items` prop. Use this when filtering must happen
 * server-side or against a source the board can't see.
 */
const EXTERNAL_FILTERS: KanbanFilter<Task>[] = [
  { id: 'high-priority', label: 'High priority' },
  { id: 'tag-bug', label: 'Tagged: bug' },
  { id: 'tag-feature', label: 'Tagged: feature' },
];

/** The parent's own matching logic, kept outside the board on purpose. */
const EXTERNAL_PREDICATES: Record<string, (item: KanbanItem<Task>) => boolean> = {
  'high-priority': (item) => item.data?.priority === 'high',
  'tag-bug': (item) => item.data?.tags.includes('bug') ?? false,
  'tag-feature': (item) => item.data?.tags.includes('feature') ?? false,
};

function ExternalFilterRenderer() {
  const [items, setItems] = React.useState<KanbanItem<Task>[]>(TASK_ITEMS);
  const [activeByColumn, setActiveByColumn] = React.useState<Record<string, string[]>>(
    {},
  );

  const handleFilterChange = (event: KanbanFilterChangeEvent<Task>) => {
    setActiveByColumn((prev) => ({
      ...prev,
      [event.column.id]: event.activeFilterIds,
    }));
  };

  /* Parent-owned filtering: derive the visible items from the active filters. */
  const visibleItems = React.useMemo(
    () =>
      items.filter((item) => {
        const active = activeByColumn[item.columnId] ?? [];
        return active.every((id) => EXTERNAL_PREDICATES[id]?.(item) ?? true);
      }),
    [items, activeByColumn],
  );

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 overflow-auto">
        <KanbanBoard<Task>
          columns={COLUMNS}
          items={visibleItems}
          onChange={(event) => setItems(event.items)}
          renderItem={renderTaskCard}
          filters={EXTERNAL_FILTERS}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Active filters by column</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {JSON.stringify(activeByColumn, null, JSON_INDENT)}
        </pre>
        <p className="text-muted-foreground mt-3 text-xs">
          The board reports filter changes; this parent component does the actual
          filtering by recomputing the <code>items</code> prop.
        </p>
      </div>
    </div>
  );
}

export const ExternalFilterCallback = {
  render: () => <ExternalFilterRenderer />,
};

/* ================================================================== */
/*  Infinite scroll                                                    */
/* ================================================================== */

const INFINITE_PAGE_SIZE = 25;
const INFINITE_LOAD_DELAY_MS = 400;
const INFINITE_TOTALS: Record<string, number> = {
  todo: 120,
  'in-progress': 60,
  done: 15,
};

/** The full pool each column pages through. */
const INFINITE_POOL: Record<string, KanbanItem[]> = Object.fromEntries(
  Object.entries(INFINITE_TOTALS).map(([columnId, total]) => [
    columnId,
    Array.from({ length: total }, (_, i) => ({
      id: `${columnId}-${i + 1}`,
      name: `${columnId} card ${i + 1}`,
      columnId,
    })),
  ]),
);

/**
 * Per-column infinite scrolling.
 *
 * Each column renders a sentinel after its last card; scrolling it into view
 * fires `infiniteScroll.onLoadMore(column)` and the parent widens that column's
 * slice. "Done" holds fewer cards than one page, so it starts fully loaded and
 * shows the end message straight away — the board never asks for more once
 * `hasMore` returns `false`.
 *
 * Only supported with `columnOverflow="scroll"`; passing it alongside
 * `"expand"` logs a development-only error and renders no sentinel.
 */
function InfiniteScrollRenderer() {
  const [loadedCounts, setLoadedCounts] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(
      Object.keys(INFINITE_TOTALS).map((id) => [id, INFINITE_PAGE_SIZE]),
    ),
  );
  const [loadingColumnId, setLoadingColumnId] = React.useState<string | null>(null);

  const items = React.useMemo(
    () =>
      Object.entries(loadedCounts).flatMap(([columnId, count]) =>
        (INFINITE_POOL[columnId] ?? []).slice(0, count),
      ),
    [loadedCounts],
  );

  /* A timer stands in for the request a real consumer would make, so the
     loading slot is actually observable in the story. */
  const handleLoadMore = React.useCallback((column: KanbanColumn) => {
    setLoadingColumnId(column.id);
    setTimeout(() => {
      setLoadedCounts((prev) => ({
        ...prev,
        [column.id]: (prev[column.id] ?? 0) + INFINITE_PAGE_SIZE,
      }));
      setLoadingColumnId(null);
    }, INFINITE_LOAD_DELAY_MS);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div className="h-[520px] flex-1">
        <KanbanBoard
          columns={COLUMNS}
          items={items}
          columnOverflow="scroll"
          infiniteScroll={{
            distance: 150,
            onLoadMore: handleLoadMore,
            hasMore: (column) =>
              (loadedCounts[column.id] ?? 0) < (INFINITE_TOTALS[column.id] ?? 0),
            isLoading: (column) => loadingColumnId === column.id,
            endMessage: (
              <span className="text-muted-foreground text-xs">No more cards</span>
            ),
          }}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Loaded per column</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {JSON.stringify(
            Object.fromEntries(
              Object.keys(INFINITE_TOTALS).map((id) => [
                id,
                `${loadedCounts[id] ?? 0} / ${INFINITE_TOTALS[id] ?? 0}`,
              ]),
            ),
            null,
            JSON_INDENT,
          )}
        </pre>
        <p className="text-muted-foreground mt-3 text-xs">
          Scroll a column to the bottom to load the next page.
        </p>
      </div>
    </div>
  );
}

export const InfiniteScrollColumns = {
  render: () => <InfiniteScrollRenderer />,
};

/**
 * The unsupported combination: `infiniteScroll` with
 * `columnOverflow="expand"`. No sentinel is rendered and a
 * development-only `console.error` explains why — check the browser console.
 */
export const InfiniteScrollUnsupportedOverflow = {
  render: (args: KanbanBoardProps) => <KanbanViewportDemo {...args} />,
  args: {
    columns: COLUMNS,
    items: HEAVY_COLUMN_ITEMS,
    columnOverflow: 'expand' satisfies ColumnOverflow,
    infiniteScroll: {
      onLoadMore: () => {},
      hasMore: () => true,
    },
  },
};

/* ================================================================== */
/*  Virtualization                                                     */
/* ================================================================== */

const VIRTUAL_TOTALS: Record<string, number> = {
  todo: 600,
  'in-progress': 250,
  done: 18,
};

/** ~870 cards across three columns; only a window of each is ever mounted. */
const VIRTUAL_ITEMS: KanbanItem[] = Object.entries(VIRTUAL_TOTALS).flatMap(
  ([columnId, total]) =>
    Array.from({ length: total }, (_, i) => ({
      id: `${columnId}-${i + 1}`,
      name: `${columnId} card ${i + 1}`,
      columnId,
    })),
);

/* The single-line cards below measure 46px, so the scrollbar is right from the
   first frame instead of settling as columns are scrolled. */
const VIRTUAL_ESTIMATED_ITEM_HEIGHT = 46;

/** Card body with the position spelled out, so a scrolled screenshot is legible. */
function renderVirtualCard(item: KanbanItem) {
  const [, index = ''] = item.name.split(/ card /u);
  return (
    <div className="flex items-center gap-2">
      <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
        #{index}
      </span>
      <span className="truncate text-sm">{item.name}</span>
    </div>
  );
}

/**
 * Counts the cards actually in the DOM. The board renders one element per
 * mounted card, so this is the number virtualization is meant to hold down.
 */
function useMountedCardCount(root: HTMLElement | null): number {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!root) return undefined;

    const update = () => {
      setCount(root.querySelectorAll('[data-testid^="kanban-item-"]').length);
    };

    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, subtree: true });
    /* The observer only reports later mutations, so prime it after first paint. */
    const frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [root]);

  return count;
}

interface VirtualizedDemoProps {
  /** Controlled: the story owns the data so paging and drops share one source. */
  items: KanbanItem[];
  onChange: (event: KanbanChangeEvent) => void;
  note: string;
  infiniteScroll?: KanbanBoardProps['infiniteScroll'];
}

function VirtualizedDemo({
  items,
  onChange,
  note,
  infiniteScroll,
}: VirtualizedDemoProps) {
  const [lastEvent, setLastEvent] = React.useState<KanbanChangeEvent | null>(null);
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const mountedCards = useMountedCardCount(root);

  const perColumn = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) counts[item.columnId] = (counts[item.columnId] ?? 0) + 1;
    return counts;
  }, [items]);

  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4 lg:flex-row">
      <div ref={setRoot} className="h-[520px] flex-1">
        <KanbanBoard
          columns={COLUMNS}
          items={items}
          columnOverflow="scroll"
          virtualization={{ estimateItemHeight: VIRTUAL_ESTIMATED_ITEM_HEIGHT }}
          infiniteScroll={infiniteScroll}
          renderItem={renderVirtualCard}
          onChange={(event) => {
            setLastEvent(event);
            onChange(event);
          }}
        />
      </div>

      <div className="w-full rounded-md border p-3 lg:w-[380px]">
        <div className="mb-2 text-sm font-medium">Mounted vs total cards</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {JSON.stringify(
            {
              mountedCards,
              totalCards: items.length,
              perColumn,
            },
            null,
            JSON_INDENT,
          )}
        </pre>
        <div className="mt-4 mb-2 text-sm font-medium">Last onChange event</div>
        <pre className="text-xs break-words whitespace-pre-wrap">
          {lastEvent
            ? JSON.stringify(displayEvent(lastEvent), null, JSON_INDENT)
            : 'Drag a card to see the event.'}
        </pre>
        <p className="text-muted-foreground mt-3 text-xs">{note}</p>
      </div>
    </div>
  );
}

/**
 * Per-column virtualization.
 *
 * Pass `virtualization` alongside `columnOverflow="scroll"` and each column
 * mounts only the cards near its own scroll window — the sidebar counts them.
 * Dragging still works across the whole list: the dragged card is pinned into
 * the render range for the length of the gesture, so auto-scrolling past the
 * window cannot unmount it mid-drag.
 *
 * Try it with the keyboard: tab to a card, press Space to pick it up, then
 * hold ↓ / ↑ to travel far beyond the mounted window before pressing Space
 * again to drop.
 */
function VirtualizedRenderer() {
  const [items, setItems] = React.useState<KanbanItem[]>(VIRTUAL_ITEMS);

  return (
    <VirtualizedDemo
      items={items}
      onChange={(event) => setItems(event.items)}
      note="Scroll or drag a column: the mounted count stays flat while the total does not."
    />
  );
}

export const VirtualizedColumns = {
  render: () => <VirtualizedRenderer />,
};

const VIRTUAL_INFINITE_PAGE_SIZE = 50;

/**
 * Virtualization and infinite scrolling together — the combination a paged
 * board actually wants. The sentinel sits below the virtualizer's spacer, so
 * it is only reached at the true end of the loaded list, and each page widens
 * the window the virtualizer draws from.
 */
function VirtualizedInfiniteRenderer() {
  /* The full pool each column pages through; drops rewrite it. */
  const [pool, setPool] = React.useState<KanbanItem[]>(VIRTUAL_ITEMS);
  const [loadedCounts, setLoadedCounts] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(
      Object.keys(VIRTUAL_TOTALS).map((id) => [id, VIRTUAL_INFINITE_PAGE_SIZE]),
    ),
  );

  /* Keep the first N of each column, by position rather than by id, so a card
     that moves columns stays visible instead of falling out of its new page. */
  const items = React.useMemo(() => {
    const seen: Record<string, number> = {};
    return pool.filter((item) => {
      seen[item.columnId] = (seen[item.columnId] ?? 0) + 1;
      return seen[item.columnId]! <= (loadedCounts[item.columnId] ?? 0);
    });
  }, [pool, loadedCounts]);

  const poolCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of pool) counts[item.columnId] = (counts[item.columnId] ?? 0) + 1;
    return counts;
  }, [pool]);

  const handleLoadMore = React.useCallback((column: KanbanColumn) => {
    setLoadedCounts((prev) => ({
      ...prev,
      [column.id]: (prev[column.id] ?? 0) + VIRTUAL_INFINITE_PAGE_SIZE,
    }));
  }, []);

  /* The board only ever sees the loaded head, so the unloaded tail is stitched
     back on — after it, which is where those cards already sat. */
  const handleChange = React.useCallback((event: KanbanChangeEvent) => {
    setPool((prev) => {
      const loaded = new Set(event.items.map((item) => item.id));
      return [...event.items, ...prev.filter((item) => !loaded.has(item.id))];
    });
  }, []);

  return (
    <VirtualizedDemo
      items={items}
      onChange={handleChange}
      note="Each column pages in 50 more cards when its sentinel is reached, below the virtualizer's spacer."
      infiniteScroll={{
        distance: 150,
        onLoadMore: handleLoadMore,
        hasMore: (column) =>
          (loadedCounts[column.id] ?? 0) < (poolCounts[column.id] ?? 0),
        endMessage: <span className="text-muted-foreground text-xs">No more cards</span>,
      }}
    />
  );
}

export const VirtualizedInfiniteScroll = {
  render: () => <VirtualizedInfiniteRenderer />,
};
