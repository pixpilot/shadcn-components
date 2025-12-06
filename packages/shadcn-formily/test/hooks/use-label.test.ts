import { useFieldSchema } from '@formily/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLabel } from '../../src/hooks/use-label';

// Mock the useFieldSchema hook
vi.mock('@formily/react', () => ({
  useFieldSchema: vi.fn(),
}));

describe('useLabel', () => {
  it('should return the provided label if not null', () => {
    const mockSchema = { name: 'testName', title: 'testTitle' };
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel('custom label'));

    expect(result.current).toBe('custom label');
  });

  it('should return null if label is null and schema has no name or title', () => {
    const mockSchema = {};
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel(null));

    expect(result.current).toBeNull();
  });

  it('should return capitalized name if name is a string', () => {
    const mockSchema = { name: 'test name' };
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel(null));

    expect(result.current).toBe('Test Name');
  });

  it('should return name as is if name is not a string', () => {
    const mockSchema = { name: 123 };
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel(null));

    expect(result.current).toBe(123);
  });

  it('should return capitalized title if title is a string and name is null', () => {
    const mockSchema = { title: 'test title' };
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel(null));

    expect(result.current).toBe('Test Title');
  });

  it('should return title as is if title is not a string and name is null', () => {
    const mockSchema = { title: true };
    (useFieldSchema as any).mockReturnValueOnce(mockSchema);

    const { result } = renderHook(() => useLabel(null));

    expect(result.current).toBe(true);
  });

  it('should return title if label is undefined and schema has both name and title', () => {
    const mockSchema = { name: 'testName', title: 'testTitle' };
    vi.mocked(useFieldSchema).mockReturnValue(mockSchema as any);

    const { result } = renderHook(() => useLabel());

    expect(result.current).toBe('Test Title');
  });
});
