# Touch and small screens

On a touch screen a finger that lands on a card is ambiguous. It could be the
start of a drag, or the start of a swipe to reach the column next door. A board
that guesses "drag" every time is unusable on a phone: the user reaches for the
next column, catches a card on the way, and the card comes with them.

The board resolves this the way native mobile UIs do — **swipe is the default,
drag has to be asked for** — and makes the columns swipeable enough to be worth
defaulting to.

Nothing here changes mouse or keyboard behaviour.

## Hold to drag

A card only becomes draggable after the finger has rested on it for 250 ms.
Movement past 8 px during that window cancels the press and hands the gesture
back to the browser as a scroll.

That is two sensors rather than one, chosen for opposite reasons:

| Sensor        | Activates on             | Why                                                                   |
| ------------- | ------------------------ | --------------------------------------------------------------------- |
| `MouseSensor` | 5 px of travel           | A mouse press can only mean "drag". Waiting would just feel sluggish. |
| `TouchSensor` | 250 ms hold, within 8 px | A finger press is ambiguous, so the board claims it only once held.   |

This is why the board uses `MouseSensor` + `TouchSensor` instead of dnd-kit's
combined `PointerSensor`: a pointer sensor can only carry one activation rule,
and these two need different ones.

### Why the cards are `touch-manipulation`, not `touch-none`

A card sits inside two scrollers the finger still has to be able to reach
through it — the column vertically and the board horizontally. `touch-action:
none` would kill both, which is the same bug from the other direction.

Instead the card leaves panning to the browser and dnd-kit takes the gesture
away only once the hold has completed, by calling `preventDefault()` on
`touchmove`. That works because a completed hold means no scroll had started;
had one started, the movement would have exceeded the tolerance and cancelled
the press first. The two rules are the same rule seen from either side.

### The press has to be visible

dnd-kit only reports a drag once it has already begun, which on touch is one
delay too late: without feedback the hold feels like nothing is happening and
the user lets go before the drag ever arms.

`useKanbanPressFeedback` watches the same touch stream under the same
constraints and rings the card while it is being held — `data-pressing` on the
card element, if you want to style it yourself. It never drives the drag; the
worst a desync can do is show or hide a ring. Turn it off with
`touch={{ pressFeedback: false }}`.

### Drag handles skip the hold

An explicit handle is already an unambiguous gesture, so it picks up on contact.
The column-reorder grip carries `data-kanban-drag-handle`, and the touch
sensor's `bypassActivationConstraint` waives the hold for anything inside such
an element.

### Tuning it

```tsx
<KanbanBoard
  columns={columns}
  items={items}
  touch={{ dragActivationDelay: 400, dragActivationTolerance: 4 }}
/>
```

Raise the delay for a board whose cards are tall enough that a vertical scroll
often begins with the finger resting a moment first. Lower it when cards are the
only thing in the column and a mis-grab costs little.

## Columns as a slider

Below the `sm` breakpoint (40rem) each column becomes a scroll-snap child about
a screen wide, so a horizontal swipe moves exactly one column and settles with
the platform's own momentum.

This is CSS only — `scroll-snap-type: x mandatory` on the board,
`scroll-snap-align` plus `scroll-snap-stop: always` on each column. No carousel
library, no scroll listener, no rAF loop. Two reasons that matters here:

- Snapping runs on the compositor, so it keeps its frame rate while the main
  thread is busy — and during a drag the main thread is very busy, because
  dnd-kit re-measures every mounted droppable per frame.
- `scroll-snap-stop: always` is what makes it a slider rather than a scroller: a
  fast flick cannot skip past a column, it stops at the next one.

Above `sm` nothing applies and the board is the same flex scroller it always was.

### Snapping is suspended during a drag

dnd-kit auto-scrolls the board by writing `scrollLeft`. Under mandatory snap
points every one of those writes would be pulled straight back to the nearest
column, and a cross-column drag would be impossible. So the board drops to
`scroll-snap-type: none` for the length of a gesture and restores it on drop.

### Options

```tsx
/* Default: columns 85% wide, resting flush left, next one peeking in. */
<KanbanBoard columns={columns} items={items} />

/* Centred and a little narrower. */
<KanbanBoard columnSnap={{ align: 'center', columnWidth: '78%' }} … />

/* Off: a plain horizontal scroller at every width. */
<KanbanBoard columnSnap={false} … />
```

`columnWidth` takes any CSS width and is applied through the
`--kanban-column-snap-width` custom property on the board. Leaving a margin is
deliberate: the sliver of the next column is what tells the user there is more
to swipe to.

The breakpoint itself is fixed at `sm`. To snap at a different width, pass
`columnSnap={false}` and put your own `snap-*` classes on `className` /
`columnClassName`.

### The add-column button snaps too

Under `scroll-snap-type: mandatory` a child with no snap point of its own is
somewhere the scroller refuses to rest. The "Add column" button therefore gets
the same snap classes as a column — without them it would be unreachable on a
phone.

## Stories

`MobileTouchBoard`, `MobileSnapCentered`, `MobileSnapDisabled` and
`MobileLongerHold` in
[`stories/KanbanBoard.stories.tsx`](../stories/KanbanBoard.stories.tsx). Open
them in a narrow viewport (or DevTools device mode) — the slider keys off the
viewport media query, so framing the board narrow on a wide screen is not enough
to reproduce it.
