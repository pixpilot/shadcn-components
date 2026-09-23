import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { IntersectionOptions } from './infinite-scroll';

/** A single item that lives inside a Kanban column. */
export interface KanbanItem<T = Record<string, unknown>> {
  /** Unique identifier for the item. */
  id: string;
  /** Display name (used by the default renderer). */
  name: string;
  /** The column id this item currently belongs to. */
  columnId: string;
  /** Arbitrary extra data attached to the item. */
  data?: T;
}

/** Definition of a single Kanban column. */
export interface KanbanColumn {
  /** Unique identifier for the column. */
  id: string;
  /** Display title rendered at the top of the column. */
  title: string;
}

/**
 * A filter that can be applied to the items of a column.
 *
 * Filters are passed to the board as props and surfaced behind a filter
 * button in each column header. They are intentionally generic: provide a
 * {@link KanbanFilter.predicate} to let the board hide non-matching cards
 * itself, or omit it and react to {@link KanbanBoardProps.onFilterChange}
 * to perform the filtering yourself (e.g. server-side).
 */
export interface KanbanFilter<T = Record<string, unknown>> {
  /** Unique identifier for the filter (unique within a column's filter set). */
  id: string;
  /** Human-readable label shown in the filter menu. */
  label: string;
  /**
   * Optional predicate deciding whether an item stays visible while this
   * filter is active. Return `true` to keep the item.
   *
   * When provided, the board filters the column's cards in place. When
   * omitted, the board only tracks the active state and fires
   * {@link KanbanBoardProps.onFilterChange} so the parent can filter itself.
   */
  predicate?: (item: KanbanItem<T>, column: KanbanColumn) => boolean;
}

/**
 * Either a flat list of filters shared by every column, or a resolver that
 * returns the filters for a given column (return `undefined`/empty for
 * columns that should not show a filter button).
 */
export type KanbanFilters<T = Record<string, unknown>> =
  | KanbanFilter<T>[]
  | ((column: KanbanColumn) => KanbanFilter<T>[] | undefined);

/** Controls how columns behave when their cards exceed the board height. */
export type ColumnOverflow = 'scroll' | 'expand';

/**
 * Touch-input behaviour.
 *
 * On a touch screen a finger that lands on a card is ambiguous: it could be the
 * start of a drag, or of a swipe to reach the next column. The board resolves
 * that the way native mobile UIs do — a card only becomes draggable after the
 * finger has been held still on it for {@link dragActivationDelay}. Anything
 * shorter, or any movement past {@link dragActivationTolerance} before the
 * delay elapses, stays a scroll.
 *
 * Mouse and keyboard input is unaffected: a mouse drag still starts as soon as
 * the pointer has travelled a few pixels.
 */
export interface KanbanTouchOptions {
  /**
   * Milliseconds a finger must rest on a card before the drag arms.
   *
   * @default 250
   */
  dragActivationDelay?: number;
  /**
   * Pixels of movement tolerated during the hold. Moving further cancels the
   * press and hands the gesture back to the browser as a scroll.
   *
   * @default 8
   */
  dragActivationTolerance?: number;
  /**
   * Renders a ring on a card while it is being held but has not armed yet, so
   * the press is visible before the drag begins.
   *
   * @default true
   */
  pressFeedback?: boolean;
}

/** Where a snapped column comes to rest inside the board's viewport. */
export type KanbanColumnSnapAlign = 'start' | 'center';

/**
 * Turns the board into a one-column-at-a-time slider on small screens, using
 * CSS scroll snapping — so the swipe keeps the platform's own momentum and
 * settling animation rather than a re-implementation of it.
 *
 * Only applies below the `sm` breakpoint (40rem); above it the board keeps its
 * regular multi-column layout. Snapping is suspended for the duration of a drag
 * so dnd-kit's auto-scroll is not fought by the snap points.
 */
export interface KanbanColumnSnapOptions {
  /**
   * Where each column lands when the swipe settles.
   *
   * @default 'start'
   */
  align?: KanbanColumnSnapAlign;
  /**
   * Any CSS width for a column while snapping is active. Leaving a margin
   * (the default 85%) keeps the next column peeking in, which is what tells the
   * user there is more to swipe to.
   *
   * @default '85%'
   */
  columnWidth?: string;
}

/**
 * Payload delivered by {@link KanbanBoardProps.onFilterChange} whenever the
 * set of active filters for a column changes.
 */
export interface KanbanFilterChangeEvent<T = Record<string, unknown>> {
  /** The column whose active filters changed. */
  column: KanbanColumn;
  /** Ids of the filters currently active on the column. */
  activeFilterIds: string[];
  /** The filter objects currently active on the column. */
  activeFilters: KanbanFilter<T>[];
}

/**
 * Per-column infinite scrolling. A sentinel is rendered after the last card of
 * every column; when it scrolls into view the board calls {@link onLoadMore}
 * for that column.
 *
 * `hasMore` and `isLoading` are resolved per column rather than passed as flat
 * booleans so a consumer that pages each column from its own request can drive
 * them independently.
 *
 * Only supported when {@link KanbanBoardProps.columnOverflow} is `'scroll'` —
 * an expanding column has no scroll edge to observe.
 */
export interface KanbanInfiniteScroll extends IntersectionOptions {
  /** Load the next page of items for `column`. */
  onLoadMore: (column: KanbanColumn) => void;
  /** Whether `column` still has items left to load. */
  hasMore: (column: KanbanColumn) => boolean;
  /** Whether a load is currently in flight for `column`. */
  isLoading?: (column: KanbanColumn) => boolean;
  /** Rendered inside a column while it is loading. */
  loadingComponent?: ReactNode;
  /** Rendered at the bottom of a column once it is fully loaded. */
  endMessage?: ReactNode;
}

/**
 * Per-column virtualization, powered by `@tanstack/react-virtual`.
 *
 * Only the cards near a column's visible window stay mounted, which is what
 * keeps a thousand-card column usable: dnd-kit re-measures every mounted
 * droppable on each drag frame, so the mounted count — not the item count — is
 * what a drag actually costs.
 *
 * The card being dragged is always kept mounted, even once it scrolls out of
 * the window. Unmounting it mid-gesture would tear down the node dnd-kit holds
 * and strand the drag.
 *
 * Only supported when {@link KanbanBoardProps.columnOverflow} is `'scroll'` —
 * an expanding column has no window to virtualize against.
 */
export interface KanbanVirtualization {
  /**
   * Height in px assumed for a card that has not been measured yet. Cards are
   * measured as soon as they mount, so this only has to be in the right
   * ballpark; a poor guess just makes the scrollbar settle as you scroll.
   *
   * @default 96
   */
  estimateItemHeight?: number;
  /**
   * How many extra cards to mount above and below the visible window. Raise it
   * if fast scrolling shows blank gaps — but every extra card is one more
   * droppable dnd-kit measures per drag frame.
   *
   * @default 6
   */
  overscan?: number;
  /**
   * Vertical gap in px between cards. Virtualized cards are positioned
   * absolutely and cannot inherit the list's flex `gap`, so the virtualizer
   * adds this to every offset instead. Keep it in sync with any custom card
   * spacing.
   *
   * @default 8
   */
  gap?: number;
  /** Renders every card again while `true`. */
  disabled?: boolean;
}

/**
 * Payload delivered by {@link KanbanBoardProps.onChange} after
 * a drag-and-drop operation completes.
 */
export interface KanbanChangeEvent<T = Record<string, unknown>> {
  /** The item that was moved. */
  item: KanbanItem<T>;
  /** Column id the item was in before the move. */
  previousColumnId: string;
  /** Column id the item is in after the move. */
  nextColumnId: string;
  /**
   * The full items array after the move, with correct ordering.
   * Use this to update your external state so positions are preserved.
   */
  items: KanbanItem<T>[];
}

/** Props for the main `<KanbanBoard />` component. */
export interface KanbanBoardProps<T = Record<string, unknown>> {
  /** All items across every column. */
  items: KanbanItem<T>[];
  /** Column definitions (order determines visual order). */
  columns: KanbanColumn[];
  /**
   * Called after a successful drag-and-drop.
   * Receives the moved item together with its previous and next column ids.
   */
  onChange?: (event: KanbanChangeEvent<T>) => void;
  /**
   * Optional custom renderer for each item card.
   * Receives the item and the column it belongs to.
   * When omitted, a default card showing `item.name` is used.
   */
  renderItem?: (item: KanbanItem<T>, column: KanbanColumn) => ReactNode;
  /**
   * Optional custom renderer for column headers.
   * Receives the column definition and the count of items inside it.
   */
  renderColumnHeader?: (column: KanbanColumn, itemCount: number) => ReactNode;
  /** Extra className applied to the root wrapper. */
  className?: string;
  /** Inline styles applied to the root wrapper. */
  style?: CSSProperties;
  /** Extra className applied to every column wrapper. */
  columnClassName?: string;
  /**
   * Additional DOM props for a column wrapper. This supports alternative
   * layouts (such as CSS grids) while retaining Kanban's drag-and-drop logic.
   */
  getColumnProps?: (column: KanbanColumn) => HTMLAttributes<HTMLDivElement>;
  /** Hides the built-in column header while keeping its drop zone active. */
  hideColumnHeaders?: boolean;
  /** Extra className applied to every item card. */
  itemClassName?: string;
  /**
   * Controls whether overflowing column cards scroll inside the column or grow
   * the column beyond the board height.
   *
   * @default 'scroll'
   */
  columnOverflow?: ColumnOverflow;
  /**
   * When `true`, renders an "Add column" button after the last column.
   * Requires {@link onAddColumn} to handle the creation.
   */
  allowAddColumn?: boolean;
  /**
   * Called when the user submits a new column name via the add-column popover.
   * Only relevant when {@link allowAddColumn} is `true`.
   */
  onAddColumn?: (title: string) => void;
  /**
   * Called after a column is reordered via drag-and-drop.
   * Receives the new columns array in the updated order.
   * When omitted, columns are not draggable.
   */
  onColumnChange?: (columns: KanbanColumn[]) => void;
  /**
   * Optional filters surfaced behind a filter button in each column header.
   *
   * Pass a flat array to share the same filters across every column, or a
   * function to resolve filters per column. A column only shows a filter
   * button when it resolves to at least one filter.
   *
   * Filters with a {@link KanbanFilter.predicate} are applied in place by the
   * board; filters without one are tracked and reported via
   * {@link onFilterChange} so the parent can do the filtering.
   */
  filters?: KanbanFilters<T>;
  /**
   * Called whenever the active filters for a column change (a filter is
   * toggled or cleared). Use this to drive external/server-side filtering.
   */
  onFilterChange?: (event: KanbanFilterChangeEvent<T>) => void;
  /**
   * Opt into per-column infinite scrolling. Requires
   * {@link columnOverflow} to be `'scroll'`; the board logs a development-only
   * error and stays inert otherwise.
   */
  infiniteScroll?: KanbanInfiniteScroll;
  /**
   * Opt into per-column virtualization, so only the cards near each column's
   * visible window are mounted. Requires {@link columnOverflow} to be
   * `'scroll'`; the board logs a development-only error and renders every card
   * otherwise.
   */
  virtualization?: KanbanVirtualization;
  /**
   * Freezes card and column dragging while `true` — for views where a drop
   * position would be meaningless, such as a filtered or externally re-sorted
   * board. Cards stay mounted and fully interactive; only the drag is off.
   */
  dragDisabled?: boolean;
  /**
   * Tunes how a touch drag arms. See {@link KanbanTouchOptions}; the defaults
   * are what most boards want, so this is mainly an escape hatch for a board
   * whose cards are unusually small or tall.
   */
  touch?: KanbanTouchOptions;
  /**
   * Makes the board swipe one column at a time on small screens. Pass `false`
   * to keep the plain horizontal scroller at every width, or an options object
   * to change the resting alignment or the column width.
   *
   * @default true
   */
  columnSnap?: boolean | KanbanColumnSnapOptions;
}
