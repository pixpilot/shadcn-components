import { createForm } from '@formily/core';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useArrayItemDraftForm } from '../../../src/components/array-common/use-array-item-draft-form';

// Mock @formily/core
vi.mock('@formily/core', () => ({
  createForm: vi.fn(),
}));

describe('useArrayItemDraftForm', () => {
  const mockParentForm = { validate: vi.fn() };

  const mockArrayField = {
    value: ['item1', 'item2', 'item3'],
    address: { toString: () => 'contacts' },
    form: mockParentForm,
  };

  const mockCreateForm = vi.mocked(createForm);

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateForm.mockReturnValue({} as any);
  });

  // ---------------------------------------------------------------------------
  // Non-autoSave (isolated draft form)
  // ---------------------------------------------------------------------------

  describe('non-autoSave mode (isolated draft form)', () => {
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
      expect(result.current.form).toBe(mockForm);
      expect(result.current.basePath).toBe('draft');
      expect(result.current.validationPath).toBeUndefined();
      expect(result.current.isolatedForm).toBe(true);
    });

    it('should create form with undefined draft for out-of-bounds index', () => {
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
      expect(result.current.form).toBe(mockForm);
    });

    it('should use initialDraftValue when index is out of bounds', () => {
      const mockForm = { values: { draft: { name: 'seed' } } };
      mockCreateForm.mockReturnValue(mockForm as any);

      renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: -1 as any,
          autoSave: false,
          initialDraftValue: { name: 'seed' },
        }),
      );

      expect(mockCreateForm).toHaveBeenCalledWith({
        values: { draft: { name: 'seed' } },
        effects: expect.any(Function),
      });
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
      expect(result.current.form).toBe(mockForm);
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
      expect(result.current.form).toBe(mockForm);
    });

    it('should create form with undefined draft when arrayField.value is not an array', () => {
      const fieldNotArray = { ...mockArrayField, value: 'not an array' };
      const mockForm = { values: { draft: undefined } };
      mockCreateForm.mockReturnValue(mockForm as any);

      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: fieldNotArray as any,
          index: 0,
          autoSave: false,
        }),
      );

      expect(mockCreateForm).toHaveBeenCalledWith({
        values: { draft: undefined },
        effects: expect.any(Function),
      });
      expect(result.current.form).toBe(mockForm);
    });

    it('should recreate form when index changes', () => {
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

      expect(result.current.form).toBe(mockForm1);

      rerender({ index: 1 });

      expect(result.current.form).toBe(mockForm2);
      expect(mockCreateForm).toHaveBeenCalledTimes(2);
    });
  });

  // ---------------------------------------------------------------------------
  // AutoSave mode (use parent form directly)
  // ---------------------------------------------------------------------------

  describe('autoSave mode (parent form)', () => {
    it('should return the parent form without calling createForm', () => {
      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: 0,
          autoSave: true,
        }),
      );

      expect(mockCreateForm).not.toHaveBeenCalled();
      expect(result.current.form).toBe(mockParentForm);
    });

    it('should set isolatedForm to false', () => {
      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: 0,
          autoSave: true,
        }),
      );

      expect(result.current.isolatedForm).toBe(false);
    });

    it('should use the numeric index as basePath', () => {
      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: 2,
          autoSave: true,
        }),
      );

      expect(result.current.basePath).toBe(2);
    });

    it('should produce a validationPath scoped to the item fields', () => {
      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: 1,
          autoSave: true,
        }),
      );

      expect(result.current.validationPath).toBe('contacts.1.*');
    });

    it('should fall back to string basePath and undefined validationPath when index is undefined', () => {
      const { result } = renderHook(() =>
        useArrayItemDraftForm({
          arrayField: mockArrayField as any,
          index: undefined,
          autoSave: true,
        }),
      );

      expect(result.current.basePath).toBe('draft');
      expect(result.current.validationPath).toBeUndefined();
    });

    it('should update basePath and validationPath when index changes', () => {
      const { result, rerender } = renderHook(
        (props) =>
          useArrayItemDraftForm({
            arrayField: mockArrayField as any,
            index: props.index,
            autoSave: true,
          }),
        { initialProps: { index: 0 } },
      );

      expect(result.current.basePath).toBe(0);
      expect(result.current.validationPath).toBe('contacts.0.*');

      rerender({ index: 2 });

      expect(result.current.basePath).toBe(2);
      expect(result.current.validationPath).toBe('contacts.2.*');
      // Still no draft form created
      expect(mockCreateForm).not.toHaveBeenCalled();
    });
  });
});
