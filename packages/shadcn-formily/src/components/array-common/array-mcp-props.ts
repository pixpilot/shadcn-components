import type { ComponentPropDescription } from '@internal/mcp';

/**
 * Prop names shared by the object-array components (ArrayCards, ArrayCollapse,
 * ArrayDialog, ArrayInline, ArrayPopover). Kept in one place so every component's
 * `mcp.ts` documents them identically.
 */
export type CommonArrayProp =
  | 'sortable'
  | 'disabled'
  | 'actions'
  | 'transformActions'
  | 'description'
  | 'onAdd'
  | 'onRemove'
  | 'onMoveUp'
  | 'onMoveDown'
  | 'onEdit'
  | 'onCopy';

/** Shared documentation for the common array-field props. */
export const commonArrayPropDocs: Record<CommonArrayProp, ComponentPropDescription> = {
  sortable: 'Enables drag-and-drop reordering of items via a drag handle.',
  disabled: 'Disables the array field and all of its item operations.',
  actions: {
    description:
      'Item action buttons. Accepts built-in operation strings and/or custom/toggle action objects. Set to false to disable all actions, including global defaults.',
    type: `('up' | 'down' | 'copy' | 'edit' | 'remove' | CustomAction | ToggleAction | OperationOverride)[] | false`,
  },
  transformActions:
    'Callback to transform the merged (global + local) action list per item render; receives the current actions and item context (index, record, array).',
  description: 'Description content rendered for the array field.',
  onAdd: 'Called with the new item index when an item is added.',
  onRemove: 'Called with the item index when an item is removed.',
  onMoveUp: 'Called with the item index when an item is moved up.',
  onMoveDown: 'Called with the item index when an item is moved down.',
  onEdit: 'Called with the item index when an item edit is triggered.',
  onCopy: 'Called with the item index when an item is copied.',
};

/**
 * Shared note describing per-item styling. Every object-array component renders one
 * wrapper element per item and forwards that item's `x-component-props` onto it.
 */
export const perItemStylingNote =
  "Per-item styling: set `items['x-component-props']` (e.g. `className`) to style/attribute each rendered item. The array node's own `x-component-props` targets the array component itself (list container / dialog / popover), not the individual items.";
