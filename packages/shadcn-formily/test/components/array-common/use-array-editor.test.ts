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
});
