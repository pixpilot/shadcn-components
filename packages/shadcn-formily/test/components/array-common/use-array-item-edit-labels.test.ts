import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useArrayItemEditLabels } from '../../../src/components/array-common/use-array-item-edit-labels';

describe('useArrayItemEditLabels', () => {
  it('should return default title and description for new item without schema', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Add New Item');
    expect(result.current.description).toBe('Enter details, then click save.');
  });

  it('should return default title and description for existing item without schema', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: false,
        autoSave: false,
        itemIndex: 2,
      }),
    );

    expect(result.current.title).toBe('Edit Item #3');
    expect(result.current.description).toBe('Edit details, then click save.');
  });

  it('should use schema title for new item', () => {
    const schema = { title: 'User' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Add User');
  });

  it('should use schema title for existing item', () => {
    const schema = { title: 'User' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: false,
        autoSave: false,
        itemIndex: 0,
      }),
    );

    expect(result.current.title).toBe('Edit User');
  });

  it('should use schema description when provided', () => {
    const schema = { title: 'User', description: 'User details' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.description).toBe('User details');
  });

  it('should handle empty string schema title', () => {
    const schema = { title: '' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Add New Item');
  });

  it('should handle whitespace-only schema title', () => {
    const schema = { title: '   ' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Add New Item');
  });

  it('should handle empty string schema description', () => {
    const schema = { title: 'User', description: '' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.description).toBe('Enter details, then click save.');
  });

  it('should handle whitespace-only schema description', () => {
    const schema = { title: 'User', description: '   ' } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.description).toBe('Enter details, then click save.');
  });

  it('should handle non-string schema title', () => {
    const schema = { title: 123 } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Add New Item');
  });

  it('should handle non-string schema description', () => {
    const schema = { title: 'User', description: {} } as any;
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema,
        isNew: true,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.description).toBe('Enter details, then click save.');
  });

  it('should use autoSave description for new item', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: true,
        autoSave: true,
        itemIndex: undefined,
      }),
    );

    expect(result.current.description).toBe('Enter details. Changes apply instantly.');
  });

  it('should use autoSave description for existing item', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: false,
        autoSave: true,
        itemIndex: 1,
      }),
    );

    expect(result.current.description).toBe('Edit details. Changes apply instantly.');
  });

  it('should handle undefined itemIndex for existing item', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: false,
        autoSave: false,
        itemIndex: undefined,
      }),
    );

    expect(result.current.title).toBe('Edit Item #1');
  });

  it('should handle zero itemIndex for existing item', () => {
    const { result } = renderHook(() =>
      useArrayItemEditLabels({
        schema: undefined,
        isNew: false,
        autoSave: false,
        itemIndex: 0,
      }),
    );

    expect(result.current.title).toBe('Edit Item #1');
  });
});
