import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEditHandlers } from '../../../src/components/array-common/use-edit-handlers';

describe('useEditHandlers', () => {
  const mockDraftForm = {
    validate: vi.fn(),
    values: { draft: 'test value' },
  };

  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDraftForm.validate.mockResolvedValue(undefined);
  });

  it('should return handleSave and handleCancel functions', () => {
    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: 0,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    expect(result.current).toHaveProperty('handleSave');
    expect(result.current).toHaveProperty('handleCancel');
    expect(typeof result.current.handleSave).toBe('function');
    expect(typeof result.current.handleCancel).toBe('function');
  });

  it('should call onSave with correct index and value when validation succeeds', async () => {
    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: 1,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleSave();

    expect(mockDraftForm.validate).toHaveBeenCalledTimes(1);
    // onSave will be called asynchronously after validation resolves
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(mockOnSave).toHaveBeenCalledWith(1, 'test value');
        resolve();
      }, 0);
    });
  });

  it('should not call onSave when validation fails', async () => {
    const validationError = new Error('Validation failed');
    mockDraftForm.validate.mockRejectedValue(validationError);

    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: 1,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleSave();

    expect(mockDraftForm.validate).toHaveBeenCalledTimes(1);
    // onSave should not be called even after timeout
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(mockOnSave).not.toHaveBeenCalled();
        resolve();
      }, 0);
    });
  });

  it('should call onSave with undefined value when draft is undefined', async () => {
    const draftFormWithUndefined = {
      validate: vi.fn().mockResolvedValue(undefined),
      values: { draft: undefined },
    };

    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: 2,
        draftForm: draftFormWithUndefined as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleSave();

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(mockOnSave).toHaveBeenCalledWith(2, undefined);
        resolve();
      }, 0);
    });
  });

  it('should not call onSave or validate when itemIndex is undefined', () => {
    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: undefined,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleSave();

    expect(mockDraftForm.validate).not.toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onCancel with correct index', () => {
    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: 3,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleCancel();

    expect(mockOnCancel).toHaveBeenCalledWith(3);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should not call onCancel when itemIndex is undefined', () => {
    const { result } = renderHook(() =>
      useEditHandlers({
        itemIndex: undefined,
        draftForm: mockDraftForm as any,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
      }),
    );

    result.current.handleCancel();

    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should memoize handleSave callback', () => {
    const { result, rerender } = renderHook(
      ({ itemIndex }) =>
        useEditHandlers({
          itemIndex,
          draftForm: mockDraftForm as any,
          onSave: mockOnSave,
          onCancel: mockOnCancel,
        }),
      { initialProps: { itemIndex: 0 } },
    );

    const firstHandleSave = result.current.handleSave;

    // Rerender with same props
    rerender({ itemIndex: 0 });

    expect(result.current.handleSave).toBe(firstHandleSave);
  });

  it('should memoize handleCancel callback', () => {
    const { result, rerender } = renderHook(
      ({ itemIndex }) =>
        useEditHandlers({
          itemIndex,
          draftForm: mockDraftForm as any,
          onSave: mockOnSave,
          onCancel: mockOnCancel,
        }),
      { initialProps: { itemIndex: 0 } },
    );

    const firstHandleCancel = result.current.handleCancel;

    // Rerender with same props
    rerender({ itemIndex: 0 });

    expect(result.current.handleCancel).toBe(firstHandleCancel);
  });

  it('should recreate handleSave when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ itemIndex }) =>
        useEditHandlers({
          itemIndex,
          draftForm: mockDraftForm as any,
          onSave: mockOnSave,
          onCancel: mockOnCancel,
        }),
      { initialProps: { itemIndex: 0 } },
    );

    const firstHandleSave = result.current.handleSave;

    // Change itemIndex
    rerender({ itemIndex: 1 });

    expect(result.current.handleSave).not.toBe(firstHandleSave);
  });

  it('should recreate handleCancel when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ itemIndex }) =>
        useEditHandlers({
          itemIndex,
          draftForm: mockDraftForm as any,
          onSave: mockOnSave,
          onCancel: mockOnCancel,
        }),
      { initialProps: { itemIndex: 0 } },
    );

    const firstHandleCancel = result.current.handleCancel;

    // Change itemIndex
    rerender({ itemIndex: 1 });

    expect(result.current.handleCancel).not.toBe(firstHandleCancel);
  });
});
