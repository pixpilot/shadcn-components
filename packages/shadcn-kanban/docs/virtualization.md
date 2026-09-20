# Virtualization

A column can mount only the cards near its own scroll window instead of all of
them, using [`@tanstack/react-virtual`](https://tanstack.com/virtual). Cards are
positioned absolutely inside a spacer tall enough to keep the scrollbar honest.

```
┌─────────────────┐ ← the column's scroller
│ ░ spacer ░░░░░░ │   height = every card, measured or estimated
│ ┌─────────────┐ │
│ │ card 186    │ │ ┐
│ │ card 187    │ │ │ only these are in the DOM
│ │ …           │ │ │ (visible window + overscan)
│ │ card 194    │ │ ┘
│ └─────────────┘ │
│ ░░░░░░░░░░░░░░░ │
└─────────────────┘
```

## Usage

```tsx
<KanbanBoard
  columns={columns}
  items={items}
  columnOverflow="scroll"
  virtualization={{ estimateItemHeight: 96 }}
/>
```

## `KanbanVirtualization`

| Field                | Type      | Default | Description                                                                                                   |
| -------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `estimateItemHeight` | `number`  | `96`    | Height assumed for an unmeasured card. Cards are measured on mount, so a rough figure is fine.                |
| `overscan`           | `number`  | `6`     | Extra cards mounted above and below the window. Raise it if fast scrolling shows gaps.                        |
| `gap`                | `number`  | `8`     | Vertical gap between cards. Absolutely positioned cards cannot inherit the list's flex `gap` (`gap-2` = 8px). |
| `disabled`           | `boolean` | `false` | Falls back to mounting every card.                                                                            |

Passing the object is what enables the feature; there is no separate flag.

### Getting `estimateItemHeight` roughly right

The estimate decides the scrollbar's length before anything is measured. Too
small and the scrollbar grows as you scroll; too large and it shrinks. Neither
breaks anything — measured cards always win — but a figure close to your real
card height keeps the scrollbar still. Measure one rendered card and use that.

### `gap` must match your spacing

The board's card list is a flex column with `gap-2` when it is not virtualized.
Absolutely positioned cards get no flex gap, so the virtualizer adds `gap` to
every offset instead. Leave it alone unless `itemClassName` changes the spacing
between cards, in which case set it to the same number of pixels.

## Only with `columnOverflow="scroll"`

An expanding column has no window to virtualize against. Passing
`virtualization` alongside `columnOverflow="expand"` logs a development-only
`console.error` (once per board) and mounts every card. It never throws — a
mis-set prop should not take a board down in production.

The board's [layout contract](./README.md#layout-contract) matters more here
than anywhere else: in scroll mode the board's **parent must have a bounded
height**. Without one the column never overflows, the window is the whole list,
and virtualization saves nothing.

## Dragging a virtualized column

This is the part that needs care, and the reason the feature is not just a
`useVirtualizer` call.

### The dragged card is pinned into the range

dnd-kit holds a reference to the dragged card's DOM node for the length of the
gesture. Auto-scrolling — or a keyboard drag travelling down a long column —
will carry that card past the window, and unmounting it there would strand the
drag with a dead node.

`KanbanVirtualColumnCards` therefore passes a `rangeExtractor` that adds the
active card's index to whatever the default extractor returned:

```ts
const rangeExtractor = (range: Range) => {
  const indexes = defaultRangeExtractor(range);
  if (activeIndex < 0 || indexes.includes(activeIndex)) return indexes;
  return [...indexes, activeIndex].sort((a, b) => a - b);
};
```

The board feeds `activeItemId` down from its drag state, so the pin follows the
card across a cross-column move too: the moment `onDragOver` previews the card
into another column, that column's virtualizer picks up the pin.

### Two transforms, two elements

Each virtual card gets a wrapper. The wrapper carries the virtual offset
(`translateY(start)`), the `KanbanItem` inside carries whatever dnd-kit's
sortable is animating. Putting both on one element would mean one writing over
the other on every drag frame.

### `SortableContext` still lists every card

The column passes **all** of its card ids to `SortableContext`, not just the
mounted ones — the sortable index of a card must not change with the scroll
position. dnd-kit tolerates ids with no measured rect: `getSortedRects` leaves a
hole and `verticalListSortingStrategy` reads around it.

### Measured sizes survive a reorder

`getItemKey` is keyed on the card id, so the virtualizer's size cache follows a
card when a drop moves it rather than staying pinned to an index.

## With infinite scroll

The two compose. The load-more sentinel is rendered after the spacer, so it is
only reached at the true end of the loaded list, and each new page simply widens
the range the virtualizer draws from. `VirtualizedInfiniteScroll` in the stories
shows the pair working together.

For a large board this is the combination you want: infinite scroll bounds what
you _fetch_, virtualization bounds what you _mount_. They solve different halves
of the same problem — 5,000 fetched cards still means 5,000 droppables for
dnd-kit to measure on every drag frame without virtualization.

## Implementation

```
kanban-board/
├── KanbanColumnCards.tsx         Plain list: one KanbanItem per card
└── KanbanVirtualColumnCards.tsx  Virtual list: spacer + windowed cards
```

`KanbanColumn` picks between the two. Both take the same props, so the column's
scroller, header, filters and sentinel are untouched by the choice.

The virtualizer measures against the column's own scroller, which reaches it as
`useState` rather than a ref for the same reason the sentinel's observer root
does — see [infinite-scroll.md](./infinite-scroll.md#the-observer-root-is-the-columns-scroller).

## Example

`packages/shadcn-kanban/stories/KanbanBoard.stories.tsx` has `VirtualizedColumns` (868
cards across three columns, with a live count of how many are actually mounted —
around 50) and `VirtualizedInfiniteScroll` (the same board, paged). The
Playwright screenshots alongside cover the mounted window, a keyboard drag down,
a keyboard drag up, and a card dropped after the column scrolled 200 cards
beyond where it was picked up.
