import { markRaw, model } from '@formily/reactive';

export type ActiveItem = number;

export interface ActiveItemManager {
  activeItem: ActiveItem | undefined;
  isNew: boolean;
  setActiveItem: (key: ActiveItem, isNew: boolean) => void;
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
    setActiveItem(key, isNew) {
      panelState.activeItem = key;
      panelState.isNew = isNew;
    },

    hasActiveItem(key) {
      return panelState.activeItem === key;
    },

    removeActiveItem(key: ActiveItem) {
      if (panelState.activeItem === key) {
        panelState.activeItem = undefined;
      }
      panelState.isNew = false;
    },

    isNewItem(index: number | null) {
      return panelState.isNew && panelState.activeItem === index;
    },
  }) as ActiveItemManager;

  return markRaw(panelState);
}
