import { markRaw, model } from '@formily/reactive';

export type ActiveItem = number;

export type NewItemMode = 'inserted' | 'draft-only';

export interface ActiveItemManager {
  activeItem: ActiveItem | undefined;
  isNew: boolean;
  newItemMode?: NewItemMode;
  newItemMethod?: 'push' | 'unshift';
  draftInitialValue?: unknown;

  setActiveItem: (
    key: ActiveItem,
    isNew: boolean,
    options?: {
      newItemMode?: NewItemMode;
      newItemMethod?: 'push' | 'unshift';
      draftInitialValue?: unknown;
    },
  ) => void;
  hasActiveItem: (key: ActiveItem) => boolean;
  removeActiveItem: (key: ActiveItem) => void;
  isNewItem: (index: number) => boolean;
}

export function createActiveItemManager(): ActiveItemManager {
  // Helper to ensure we never store more than one key in solo mode

  // eslint-disable-next-line ts/no-unnecessary-type-assertion
  const panelState = model<ActiveItemManager>({
    activeItem: undefined,
    isNew: false,
    newItemMode: undefined,
    newItemMethod: undefined,
    draftInitialValue: undefined,

    setActiveItem(key, isNew, options) {
      panelState.activeItem = key;
      panelState.isNew = isNew;
      panelState.newItemMode = isNew ? options?.newItemMode : undefined;
      panelState.newItemMethod = isNew ? options?.newItemMethod : undefined;
      panelState.draftInitialValue =
        isNew && options?.newItemMode === 'draft-only'
          ? options?.draftInitialValue
          : undefined;
    },

    hasActiveItem(key) {
      return panelState.activeItem === key;
    },

    removeActiveItem(key: ActiveItem) {
      if (panelState.activeItem === key) {
        panelState.activeItem = undefined;
      }
      panelState.isNew = false;
      panelState.newItemMode = undefined;
      panelState.newItemMethod = undefined;
      panelState.draftInitialValue = undefined;
    },

    isNewItem(index: number | null) {
      return panelState.isNew && panelState.activeItem === index;
    },
  }) as ActiveItemManager;

  return markRaw(panelState);
}
