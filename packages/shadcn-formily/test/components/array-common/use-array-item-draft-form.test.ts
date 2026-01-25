import { createForm } from '@formily/core';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useArrayItemDraftForm } from '../../../src/components/array-common/use-array-item-draft-form';

// Mock @formily/core
vi.mock('@formily/core', () => ({
  createForm: vi.fn(),
}));

describe('useArrayItemDraftForm', () => {
  const mockArrayField = {
    value: ['item1', 'item2', 'item3'],
  };

  const mockCreateForm = vi.mocked(createForm);

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateForm.mockReturnValue({} as any);
  });

  it('should create form with correct initial values for valid index', () => {
    const mockForm = { values: { draft: 'item2' } };
    mockCreateForm.mockReturnValue(mockForm as any);

    const { result } = renderHook(() =>
      useArrayItemDraftForm({
        arrayField: mockArrayField as any,
        index: 1,
        autoSave: false,
      }),
    );

    expect(mockCreateForm).toHaveBeenCalledWith({
      values: { draft: 'item2' },
      effects: expect.any(Function),
    });
    expect(result.current).toBe(mockForm);
  });

  it('should create form with undefined draft for invalid index', () => {
    const mockForm = { values: { draft: undefined } };
    mockCreateForm.mockReturnValue(mockForm as any);

    const { result } = renderHook(() =>
      useArrayItemDraftForm({
        arrayField: mockArrayField as any,
        index: 10,
        autoSave: false,
      }),
    );

    expect(mockCreateForm).toHaveBeenCalledWith({
      values: { draft: undefined },
      effects: expect.any(Function),
    });
    expect(result.current).toBe(mockForm);
  });

  it('should create form with undefined draft for null index', () => {
    const mockForm = { values: { draft: undefined } };
    mockCreateForm.mockReturnValue(mockForm as any);

    const { result } = renderHook(() =>
      useArrayItemDraftForm({
        arrayField: mockArrayField as any,
        index: null as any,
        autoSave: false,
      }),
    );

    expect(mockCreateForm).toHaveBeenCalledWith({
      values: { draft: undefined },
      effects: expect.any(Function),
    });
    expect(result.current).toBe(mockForm);
  });

  it('should create form with undefined draft for undefined index', () => {
    const mockForm = { values: { draft: undefined } };
    mockCreateForm.mockReturnValue(mockForm as any);

    const { result } = renderHook(() =>
      useArrayItemDraftForm({
        arrayField: mockArrayField as any,
        index: undefined,
        autoSave: false,
      }),
    );

    expect(mockCreateForm).toHaveBeenCalledWith({
      values: { draft: undefined },
      effects: expect.any(Function),
    });
    expect(result.current).toBe(mockForm);
  });

  it('should create form with undefined draft when arrayField.value is not an array', () => {
    const mockArrayFieldNotArray = { value: 'not an array' };
    const mockForm = { values: { draft: undefined } };
    mockCreateForm.mockReturnValue(mockForm as any);

    const { result } = renderHook(() =>
      useArrayItemDraftForm({
        arrayField: mockArrayFieldNotArray as any,
        index: 0,
        autoSave: false,
      }),
    );

    expect(mockCreateForm).toHaveBeenCalledWith({
      values: { draft: undefined },
      effects: expect.any(Function),
    });
    expect(result.current).toBe(mockForm);
  });

  it('should recreate form when dependencies change', () => {
    const mockForm1 = { values: { draft: 'item1' } };
    const mockForm2 = { values: { draft: 'item2' } };
    mockCreateForm
      .mockReturnValueOnce(mockForm1 as any)
      .mockReturnValueOnce(mockForm2 as any);

    const { result, rerender } = renderHook(
      (props) =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: props.index,
          autoSave: false,
        }),
      { initialProps: { index: 0 } },
    );

    expect(result.current).toBe(mockForm1);

    // Change index
    rerender({ index: 1 });

    expect(result.current).toBe(mockForm2);
    expect(mockCreateForm).toHaveBeenCalledTimes(2);
  });
});
