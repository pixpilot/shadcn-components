import { describe, expect, it } from 'vitest';
import { createPanelStateManager } from '../../src/utils';

describe('createPanelStateManager', () => {
  describe('initialization', () => {
    it('should create state manager with empty active keys by default', () => {
      const manager = createPanelStateManager();

      expect(manager.activeKeys).toEqual([]);
    });

    it('should create state manager with provided default active keys', () => {
      const defaultKeys = ['panel1', 'panel2'];
      const manager = createPanelStateManager(defaultKeys);

      expect(manager.activeKeys).toEqual(defaultKeys);
    });

    it('should create state manager with mixed string and number keys', () => {
      const defaultKeys: Array<string | number> = ['panel1', 2, 'panel3'];
      const manager = createPanelStateManager(defaultKeys);

      expect(manager.activeKeys).toEqual(defaultKeys);
    });
  });

  describe('setActiveKeys', () => {
    it('should set active keys to new array', () => {
      const manager = createPanelStateManager();

      manager.setActiveKeys(['key1', 'key2']);

      expect(manager.activeKeys).toEqual(['key1', 'key2']);
    });

    it('should replace existing active keys', () => {
      const manager = createPanelStateManager(['old1', 'old2']);

      manager.setActiveKeys(['new1']);

      expect(manager.activeKeys).toEqual(['new1']);
    });

    it('should handle empty array', () => {
      const manager = createPanelStateManager(['key1']);

      manager.setActiveKeys([]);

      expect(manager.activeKeys).toEqual([]);
    });
  });

  describe('hasActiveKey', () => {
    it('should return true when key exists', () => {
      const manager = createPanelStateManager(['key1', 'key2']);

      expect(manager.hasActiveKey('key1')).toBe(true);
      expect(manager.hasActiveKey('key2')).toBe(true);
    });

    it('should return false when key does not exist', () => {
      const manager = createPanelStateManager(['key1']);

      expect(manager.hasActiveKey('key2')).toBe(false);
    });

    it('should work with number keys', () => {
      const manager = createPanelStateManager([1, 2]);

      expect(manager.hasActiveKey(1)).toBe(true);
      expect(manager.hasActiveKey(3)).toBe(false);
    });

    it('should handle empty active keys', () => {
      const manager = createPanelStateManager([]);

      expect(manager.hasActiveKey('any')).toBe(false);
    });
  });

  describe('addActiveKey', () => {
    it('should add new key to active keys', () => {
      const manager = createPanelStateManager(['key1']);

      manager.addActiveKey('key2');

      expect(manager.activeKeys).toEqual(['key1', 'key2']);
    });

    it('should not add duplicate key', () => {
      const manager = createPanelStateManager(['key1', 'key2']);

      manager.addActiveKey('key1');

      expect(manager.activeKeys).toEqual(['key1', 'key2']);
    });

    it('should add key to empty active keys', () => {
      const manager = createPanelStateManager([]);

      manager.addActiveKey('key1');

      expect(manager.activeKeys).toEqual(['key1']);
    });

    it('should work with number keys', () => {
      const manager = createPanelStateManager([1]);

      manager.addActiveKey(2);

      expect(manager.activeKeys).toEqual([1, 2]);
    });
  });

  describe('removeActiveKey', () => {
    it('should remove existing key from active keys', () => {
      const manager = createPanelStateManager(['key1', 'key2', 'key3']);

      manager.removeActiveKey('key2');

      expect(manager.activeKeys).toEqual(['key1', 'key3']);
    });

    it('should not change active keys when key does not exist', () => {
      const manager = createPanelStateManager(['key1', 'key2']);

      manager.removeActiveKey('key3');

      expect(manager.activeKeys).toEqual(['key1', 'key2']);
    });

    it('should work with number keys', () => {
      const manager = createPanelStateManager([1, 2, 3]);

      manager.removeActiveKey(2);

      expect(manager.activeKeys).toEqual([1, 3]);
    });

    it('should handle removing from empty active keys', () => {
      const manager = createPanelStateManager([]);

      manager.removeActiveKey('key1');

      expect(manager.activeKeys).toEqual([]);
    });
  });

  describe('toggleActiveKey', () => {
    it('should add key when it does not exist', () => {
      const manager = createPanelStateManager(['key1']);

      manager.toggleActiveKey('key2');

      expect(manager.activeKeys).toEqual(['key1', 'key2']);
    });

    it('should remove key when it exists', () => {
      const manager = createPanelStateManager(['key1', 'key2']);

      manager.toggleActiveKey('key1');

      expect(manager.activeKeys).toEqual(['key2']);
    });

    it('should toggle multiple times correctly', () => {
      const manager = createPanelStateManager([]);

      manager.toggleActiveKey('key1');
      expect(manager.activeKeys).toEqual(['key1']);

      manager.toggleActiveKey('key1');
      expect(manager.activeKeys).toEqual([]);

      manager.toggleActiveKey('key1');
      expect(manager.activeKeys).toEqual(['key1']);
    });

    it('should work with number keys', () => {
      const manager = createPanelStateManager([1]);

      manager.toggleActiveKey(2);
      expect(manager.activeKeys).toEqual([1, 2]);

      manager.toggleActiveKey(1);
      expect(manager.activeKeys).toEqual([2]);
    });
  });

  describe('swapActiveKeys', () => {
    it('should swap active states when both keys are active', () => {
      const manager = createPanelStateManager([0, 1, 2]) as any;

      manager.swapActiveKeys(0, 2);

      expect(manager.activeKeys).toEqual([1, 2, 0]);
    });

    it('should swap active states when only first key is active', () => {
      const manager = createPanelStateManager([0, 2]) as any;

      manager.swapActiveKeys(0, 1);

      expect(manager.activeKeys).toEqual([2, 1]);
    });

    it('should swap active states when only second key is active', () => {
      const manager = createPanelStateManager([1, 2]) as any;

      manager.swapActiveKeys(0, 1);

      expect(manager.activeKeys).toEqual([2, 0]);
    });

    it('should swap active states when neither key is active', () => {
      const manager = createPanelStateManager([2, 3]) as any;

      manager.swapActiveKeys(0, 1);

      expect(manager.activeKeys).toEqual([2, 3]);
    });

    it('should handle swapping same index', () => {
      const manager = createPanelStateManager([0, 1, 2]) as any;

      manager.swapActiveKeys(1, 1);

      expect(manager.activeKeys).toEqual([0, 2, 1]);
    });
  });

  describe('solo mode', () => {
    it('should initialize with only first key when solo is true and default keys provided', () => {
      const manager = createPanelStateManager(['key1', 'key2'], true);

      expect(manager.activeKeys).toEqual(['key1']);
    });

    it('should allow only one active key when adding in solo mode', () => {
      const manager = createPanelStateManager([], true);

      manager.addActiveKey('key1');
      expect(manager.activeKeys).toEqual(['key1']);

      manager.addActiveKey('key2');
      expect(manager.activeKeys).toEqual(['key2']);
    });

    it('should replace all keys with single key when setActiveKeys in solo mode', () => {
      const manager = createPanelStateManager([], true);

      manager.setActiveKeys(['key1', 'key2', 'key3']);
      expect(manager.activeKeys).toEqual(['key1']);
    });

    it('should allow empty array when setActiveKeys with empty array in solo mode', () => {
      const manager = createPanelStateManager(['key1'], true);

      manager.setActiveKeys([]);
      expect(manager.activeKeys).toEqual([]);
    });

    it('should work normally with toggle in solo mode', () => {
      const manager = createPanelStateManager([], true);

      manager.toggleActiveKey('key1');
      expect(manager.activeKeys).toEqual(['key1']);

      manager.toggleActiveKey('key2');
      expect(manager.activeKeys).toEqual(['key2']);

      manager.toggleActiveKey('key2');
      expect(manager.activeKeys).toEqual([]);
    });

    it('should work normally with remove in solo mode', () => {
      const manager = createPanelStateManager(['key1'], true);

      manager.removeActiveKey('key1');
      expect(manager.activeKeys).toEqual([]);
    });
  });
});
