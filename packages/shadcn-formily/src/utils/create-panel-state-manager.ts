import { markRaw, model } from '@formily/reactive';

export type ActiveKey = string | number;

export type ActiveKeys = Array<ActiveKey>;

export interface PanelStateManager {
  activeKeys: ActiveKeys | undefined;
  setActiveKeys: (keys: ActiveKeys) => void;
  hasActiveKey: (key: ActiveKey) => boolean;
  addActiveKey: (key: ActiveKey) => void;
  removeActiveKey: (key: ActiveKey) => void;
  toggleActiveKey: (key: ActiveKey) => void;
  swapActiveKeys: (index: ActiveKey, displacedIndex: ActiveKey) => void;
}

export function createPanelStateManager(
  defaultActiveKeys?: ActiveKeys,
  solo: boolean = false,
): PanelStateManager {
  // Helper to ensure we never store more than one key in solo mode
  const enforceSolo = (keys: ActiveKeys) => (solo ? keys.slice(0, 1) : keys);

  const panelState = model({
    activeKeys: enforceSolo(defaultActiveKeys ?? []),

    setActiveKeys(keys: ActiveKeys) {
      panelState.activeKeys = enforceSolo(keys);
    },

    hasActiveKey(key: ActiveKey) {
      return panelState.activeKeys.includes(key);
    },

    addActiveKey(key: ActiveKey) {
      if (panelState.hasActiveKey(key)) return;

      panelState.activeKeys = enforceSolo(solo ? [key] : [...panelState.activeKeys, key]);
    },

    removeActiveKey(key: ActiveKey) {
      panelState.activeKeys = panelState.activeKeys.filter((item) => item !== key);
    },

    toggleActiveKey(key: ActiveKey) {
      if (panelState.hasActiveKey(key)) {
        panelState.removeActiveKey(key);
      } else {
        panelState.addActiveKey(key);
      }
    },

    swapActiveKeys(index: number, displacedIndex: number) {
      const wasOpen = panelState.hasActiveKey(index);
      const displacedWasOpen = panelState.hasActiveKey(displacedIndex);
      panelState.removeActiveKey(index);
      panelState.removeActiveKey(displacedIndex);
      if (wasOpen) panelState.addActiveKey(displacedIndex);
      if (displacedWasOpen) panelState.addActiveKey(index);
    },
  });

  return markRaw(panelState) as PanelStateManager;
}
