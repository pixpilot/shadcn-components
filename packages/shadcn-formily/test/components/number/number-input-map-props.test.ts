import type { Field } from '@formily/core';
import { useFieldSchema } from '@formily/react';
import { describe, expect, it, vi } from 'vitest';
import { mapNumberInputProps } from '../../../src/components/number/number-input-map-props';

// Mock the hooks
vi.mock('@formily/react', () => ({
  useFieldSchema: vi.fn(),
}));

describe('mapNumberInputProps', () => {
  const mockUseFieldSchema = vi.mocked(useFieldSchema);

  // Helper to create mock field
  const createMockField = (value: unknown): Field =>
    ({
      value,
      onInput: vi.fn().mockResolvedValue(undefined),
    }) as any;

  it('should set type to "number"', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    expect(result.type).toBe('number');
  });

  it('should set min and max from schema', () => {
    mockUseFieldSchema.mockReturnValue({ minimum: 0, maximum: 100 } as any);
    const field = createMockField(50);
    const result = mapNumberInputProps({}, field);
    expect(result.min).toBe(0);
    expect(result.max).toBe(100);
  });

  it('should handle number value', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    expect(result.value).toBe(42);
  });

  it('should handle string value', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField('42');
    const result = mapNumberInputProps({}, field);
    expect(result.value).toBe('42');
  });

  it('should handle null value as empty string', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(null);
    const result = mapNumberInputProps({}, field);
    expect(result.value).toBe('');
  });

  it('should handle undefined value as empty string', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(undefined);
    const result = mapNumberInputProps({}, field);
    expect(result.value).toBe('');
  });

  it('should handle object value as empty string', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField({});
    const result = mapNumberInputProps({}, field);
    expect(result.value).toBe('');
  });

  it('should spread additional props', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps(
      { placeholder: 'Enter number', disabled: true },
      field,
    );
    expect(result.placeholder).toBe('Enter number');
    expect(result.disabled).toBe(true);
  });

  it('should override type if provided in props', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({ type: 'text' }, field);
    expect(result.type).toBe('number'); // Should override to 'number'
  });

  it('should call onInput with undefined for empty string', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(undefined);
  });

  it('should convert valid number string to number', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '123' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(123);
  });

  it('should handle decimal with dot', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '12.34' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(12.34);
  });

  it('should normalize comma to dot for decimals', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '12,34' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(12.34);
  });

  it('should keep raw string for invalid number', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: 'abc' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith('abc' as unknown as number);
  });

  it('should handle negative numbers', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '-5' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(-5);
  });

  it('should handle zero', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '0' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(0);
  });

  it('should handle leading zeros', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '007' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(7);
  });

  it('should handle scientific notation', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '1e3' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(1000);
  });

  it('should handle invalid scientific notation as raw string', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '1e' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith('1e' as unknown as number);
  });

  it('should handle string with spaces as valid after trim', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: ' 123 ' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(123);
  });

  it('should handle only spaces as empty', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '   ' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(undefined);
  });

  it('should handle very large numbers', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '1000000000000000000000' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith(1000000000000000000000);
  });

  it('should handle decimal with multiple dots as invalid', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '12.34.56' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith('12.34.56' as unknown as number);
  });

  it('should handle comma without normalization if already has dot', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '12.34,56' } } as any;
    result.onChange!(mockEvent);
    expect(field.onInput).toHaveBeenCalledWith('12.34,56' as unknown as number); // Since it has dot, comma not replaced
  });

  it('should handle schema without min/max', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    expect(result.min).toBeUndefined();
    expect(result.max).toBeUndefined();
  });

  it('should handle schema with only minimum', () => {
    mockUseFieldSchema.mockReturnValue({ minimum: 10 } as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    expect(result.min).toBe(10);
    expect(result.max).toBeUndefined();
  });

  it('should handle schema with only maximum', () => {
    mockUseFieldSchema.mockReturnValue({ maximum: 100 } as any);
    const field = createMockField(42);
    const result = mapNumberInputProps({}, field);
    expect(result.min).toBeUndefined();
    expect(result.max).toBe(100);
  });

  it('should handle onInput rejection gracefully', () => {
    mockUseFieldSchema.mockReturnValue({} as any);
    const field = createMockField(42);
    field.onInput = vi.fn().mockRejectedValue(new Error('Test error'));
    const result = mapNumberInputProps({}, field);
    const mockEvent = { target: { value: '123' } } as any;
    expect(() => result.onChange!(mockEvent)).not.toThrow();
  });

  // Note: Since the function uses a hook, but we're mocking it, and calling directly,
  // but actually, useFieldSchema is called inside the function, so in tests, since it's mocked,
  // it should work. But to be safe, perhaps wrap in renderHook, but since it's not a hook, maybe not needed.

  // Actually, the function is not a hook, it's a function that calls a hook, so in tests, mocking the hook is fine.
});
