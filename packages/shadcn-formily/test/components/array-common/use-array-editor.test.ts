import { useField, useFieldSchema } from '@formily/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useArrayEditor } from '../../../src/components/array-common/use-array-editor';

// Mock the hooks
vi.mock('@formily/react', () => ({
  useField: vi.fn(),
  useFieldSchema: vi.fn(),
}));

describe('useArrayEditor', () => {
  const mockField = {
    address: { toString: () => 'test.address' },
    form: {
      setValuesIn: vi.fn(),
    },
    value: ['item1', 'item2'],
    remove: vi.fn().mockResolvedValue(undefined),
    push: vi.fn().mockResolvedValue(undefined),
    unshift: vi.fn().mockResolvedValue(undefined),
    setValue: vi.fn(),
  };

  const mockSchema = {
    items: { type: 'string' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useField).mockReturnValue(mockField as any);
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useArrayEditor({}));

    expect(result.current.field).toBe(mockField);
    expect(typeof result.current.handleEdit).toBe('function');
    expect(typeof result.current.handleAdd).toBe('function');
    expect(typeof result.current.handleSaveClick).toBe('function');
    expect(typeof result.current.handleLiveChange).toBe('function');
    expect(typeof result.current.handleCancelClick).toBe('function');
    expect(typeof result.current.isNewItem).toBe('function');
  });

  it('should call onEdit when handleEdit is called', () => {
    const onEdit = vi.fn();
    const { result } = renderHook(() => useArrayEditor({ onEdit }));

    result.current.handleEdit(1);

    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('should call onAdd when handleAdd is called', () => {
    const onAdd = vi.fn();
    const { result } = renderHook(() => useArrayEditor({ onAdd }));

    result.current.handleAdd(1);

    expect(onAdd).toHaveBeenCalledWith(1);
  });

  it('should set value and remove active item on handleSaveClick', () => {
    const { result } = renderHook(() => useArrayEditor({}));

    result.current.handleSaveClick(1, 'new value');

    expect(mockField.form.setValuesIn).toHaveBeenCalledWith(
      'test.address.1',
      'new value',
    );
  });

  it('should set value on handleLiveChange', () => {
    const { result } = renderHook(() => useArrayEditor({}));

    result.current.handleLiveChange(1, 'updated value');

    expect(mockField.form.setValuesIn).toHaveBeenCalledWith(
      'test.address.1',
      'updated value',
    );
  });

  it('should remove active item on handleCancelClick for existing item', () => {
    const { result } = renderHook(() => useArrayEditor({}));

    // First add an item to make it active
    result.current.handleEdit(1);
    expect(result.current.isNewItem(1)).toBe(false);

    result.current.handleCancelClick(1);

    // Should not call remove since it's not a new item
    expect(mockField.remove).not.toHaveBeenCalled();
  });

  it('should not remove item on handleCancelClick for new item when autoSave is false', () => {
    const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

    // Manual-save mode opens a draft-only new item (no array insertion).
    result.current.handleAdd(2);

    expect(result.current.isNewItem(-1)).toBe(true);

    result.current.handleCancelClick(-1);

    expect(mockField.remove).not.toHaveBeenCalled();
  });

  it('should not remove anything on cancel for draft-only new item (manual-save)', () => {
    const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

    result.current.handleAdd(2, {
      mode: 'draft-only',
      method: 'push',
      initialDraftValue: { name: 'seed' },
    });

    // draft-only uses a sentinel index
    result.current.handleCancelClick(-1);

    expect(mockField.remove).not.toHaveBeenCalled();
  });

  it('should push the new item on save for draft-only new item (manual-save)', () => {
    const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

    result.current.handleAdd(2, { mode: 'draft-only', method: 'push' });
    result.current.handleSaveClick(-1, 'new item');

    expect(mockField.push).toHaveBeenCalledWith('new item');
  });

  it('should unshift the new item on save for draft-only new item when method is unshift', () => {
    const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

    result.current.handleAdd(2, { mode: 'draft-only', method: 'unshift' });
    result.current.handleSaveClick(-1, 'new item');

    expect(mockField.unshift).toHaveBeenCalledWith('new item');
  });

  it('should not remove item on handleCancelClick for new item when autoSave is true', () => {
    const { result } = renderHook(() => useArrayEditor({ autoSave: true }));

    // Add a new item
    result.current.handleAdd(2);

    result.current.handleCancelClick(2);

    expect(mockField.remove).not.toHaveBeenCalled();
  });

  it('should handle setValuesIn not available', () => {
    const fieldWithoutSetValuesIn = {
      ...mockField,
      form: {},
    };
    vi.mocked(useField).mockReturnValue(fieldWithoutSetValuesIn as any);

    const { result } = renderHook(() => useArrayEditor({}));

    result.current.handleSaveClick(1, 'new value');

    expect(fieldWithoutSetValuesIn.setValue).toHaveBeenCalledWith(['item1', 'new value']);
  });

  it('should handle non-array value', () => {
    const fieldWithNonArray = {
      ...mockField,
      value: 'not an array',
    };
    vi.mocked(useField).mockReturnValue(fieldWithNonArray as any);

    const { result } = renderHook(() => useArrayEditor({}));

    result.current.handleSaveClick(1, 'new value');

    // Should not crash, but since value is not array, setValue won't be called
    expect(fieldWithNonArray.setValue).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // handleAdd routing: autoSave determines whether items are inserted
  // immediately ('inserted') or opened as a draft for confirmation ('draft-only').
  // -------------------------------------------------------------------------

  describe('handleAdd draft-only routing', () => {
    it('uses draft-only mode when autoSave is undefined (not passed)', () => {
      const { result } = renderHook(() => useArrayEditor({}));

      result.current.handleAdd(0);

      /*
       * When autoSave is not set, !isAutoSave is true, so handleAdd places a
       * draft-only sentinel at DRAFT_ONLY_INDEX (-1), not at the real index.
       */
      expect(result.current.isNewItem(-1)).toBe(true);
      expect(result.current.isNewItem(0)).toBe(false);
    });

    it('uses inserted mode when autoSave is true', () => {
      const { result } = renderHook(() => useArrayEditor({ autoSave: true }));

      result.current.handleAdd(3);

      /*
       * With autoSave=true the item is added immediately at the real index;
       * the active item is set to that real index.
       */
      expect(result.current.isNewItem(3)).toBe(true);
      expect(result.current.isNewItem(-1)).toBe(false);
    });

    it('uses draft-only mode when autoSave is false', () => {
      const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

      result.current.handleAdd(1);

      expect(result.current.isNewItem(-1)).toBe(true);
      expect(result.current.isNewItem(1)).toBe(false);
    });

    it('forces draft-only when options.mode=draft-only regardless of autoSave', () => {
      const { result } = renderHook(() => useArrayEditor({ autoSave: true }));

      result.current.handleAdd(2, { mode: 'draft-only' });

      expect(result.current.isNewItem(-1)).toBe(true);
    });

    it('isNewItem returns false after active item is cleared via save', () => {
      const { result } = renderHook(() => useArrayEditor({ autoSave: true }));

      result.current.handleAdd(0);
      expect(result.current.isNewItem(0)).toBe(true);

      result.current.handleSaveClick(0, 'saved');

      expect(result.current.isNewItem(0)).toBe(false);
    });

    it('isNewItem returns false after active item is cleared via cancel', () => {
      const { result } = renderHook(() => useArrayEditor({ autoSave: false }));

      result.current.handleAdd(0);
      expect(result.current.isNewItem(-1)).toBe(true);

      result.current.handleCancelClick(-1);

      expect(result.current.isNewItem(-1)).toBe(false);
    });
  });

  describe('handleEdit', () => {
    it('sets active item to the given index and marks it as NOT new', () => {
      const { result } = renderHook(() => useArrayEditor({}));

      result.current.handleEdit(5);

      expect(result.current.isNewItem(5)).toBe(false);
      expect(result.current.activeItemManager.activeItem).toBe(5);
      expect(result.current.activeItemManager.isNew).toBe(false);
    });

    it('replaces a previously active item', () => {
      const { result } = renderHook(() => useArrayEditor({}));

      result.current.handleEdit(2);
      result.current.handleEdit(4);

      expect(result.current.activeItemManager.activeItem).toBe(4);
    });
  });

  describe('handleSaveClick for existing items', () => {
    it('persists value and removes the active item', () => {
      const { result } = renderHook(() => useArrayEditor({}));

      result.current.handleEdit(1);
      result.current.handleSaveClick(1, 'updated');

      expect(mockField.form.setValuesIn).toHaveBeenCalledWith(
        'test.address.1',
        'updated',
      );
      expect(result.current.activeItemManager.activeItem).toBeUndefined();
    });
  });

  describe('handleLiveChange', () => {
    it('persists value without clearing the active item', () => {
      const { result } = renderHook(() => useArrayEditor({}));

      result.current.handleEdit(0);
      result.current.handleLiveChange(0, 'live');

      expect(mockField.form.setValuesIn).toHaveBeenCalledWith('test.address.0', 'live');
      // Active item should still be set after a live change
      expect(result.current.activeItemManager.activeItem).toBe(0);
    });
  });
});
