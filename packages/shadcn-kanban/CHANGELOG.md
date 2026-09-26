# @pixpilot/shadcn-kanban

## 1.1.2

### Patch Changes

- Updated dependencies
  - @pixpilot/shadcn-ui@3.18.0

## 1.1.1

### Patch Changes

- Updated dependencies
- Updated dependencies [e29bbee]
  - @pixpilot/shadcn-ui@3.17.6

## 1.1.0

### Minor Changes

- add touch-friendly dragging and column snapping
- 12310c9: Make the board usable on touch screens.

  A finger on a card no longer starts a drag on contact. Card dragging now waits
  for a 250 ms hold (tunable via the new `touch` prop), so a swipe that happens to
  begin on top of a card scrolls the board instead of dragging the card away. The
  card rings while it is held, so the hold is visible before the drag arms.

  Below the `sm` breakpoint columns become CSS scroll-snap children roughly a
  screen wide, so a swipe pages exactly one column with the platform's own
  momentum. Controlled by the new `columnSnap` prop; pass `false` for the previous
  plain scroller.

  Mouse and keyboard activation are unchanged.

  Behavioural notes for existing consumers:
  - Cards are now `touch-action: manipulation` instead of `touch-action: none`,
    and `user-select: none`.
  - Below `sm`, columns are sized from `--kanban-column-snap-width` rather than
    `flex-1`, unless `columnSnap={false}`.
  - The column reorder grip gained an `aria-label` and a `data-kanban-drag-handle`
    attribute; a column wrapper gained `data-testid="kanban-column-<id>"`.

## 1.0.0

### Major Changes

- c0a92c0: first release

### Minor Changes

- add drag-and-drop kanban board package

### Patch Changes

- Updated dependencies
  - @pixpilot/shadcn-ui@3.17.5

## 0.3.0

### Minor Changes

- add drag-and-drop kanban board package

### Patch Changes

- Updated dependencies
  - @pixpilot/shadcn-ui@3.17.4

## 0.2.0

### Minor Changes

- add drag-and-drop kanban board package

### Patch Changes

- Updated dependencies
  - @pixpilot/shadcn-ui@3.17.3

## 0.1.0

### Minor Changes

- add drag-and-drop kanban board package

### Patch Changes

- Updated dependencies
  - @pixpilot/shadcn-ui@3.17.2
