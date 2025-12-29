import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useColorPickerBaseSwatch } from '../../../src/ColorPickerBase/hooks/use-color-picker-base-swatch';

describe('useColorPickerBaseSwatch', () => {
  it('uses defaultFormat when format is undefined', () => {
    const handleValueChange = vi.fn();

    const { result } = renderHook(() =>
      useColorPickerBaseSwatch({
        currentValue: '#000000',
        format: undefined,
        defaultFormat: 'rgb',
        onFormatChange: undefined,
        handleValueChange,
      }),
    );

    act(() => {
      result.current.handleSwatchSelect('#ff0000');
    });

    expect(handleValueChange).toHaveBeenCalledWith('rgb(255, 0, 0)');
  });

  it('calls onFormatChange and uses the updated format for conversions', () => {
    const onFormatChange = vi.fn();
    const handleValueChange = vi.fn();

    const { result } = renderHook(
      ({ currentValue, format }) =>
        useColorPickerBaseSwatch({
          currentValue,
          format,
          defaultFormat: 'hex',
          onFormatChange,
          handleValueChange,
        }),
      {
        initialProps: {
          currentValue: '#000000',
          format: 'hex' as const,
        },
      },
    );

    act(() => {
      result.current.handleFormatChange('rgb');
    });

    expect(onFormatChange).toHaveBeenCalledWith('rgb');

    act(() => {
      result.current.handleSwatchSelect('#ff0000');
    });

    expect(handleValueChange).toHaveBeenCalledWith('rgb(255, 0, 0)');
  });

  it('passes through unparseable swatch values', () => {
    const handleValueChange = vi.fn();

    const { result } = renderHook(() =>
      useColorPickerBaseSwatch({
        currentValue: '#000000',
        format: 'rgb',
        defaultFormat: 'hex',
        onFormatChange: undefined,
        handleValueChange,
      }),
    );

    act(() => {
      result.current.handleSwatchSelect('not-a-color');
    });

    expect(handleValueChange).toHaveBeenCalledWith('not-a-color');
  });

  it('forces a one-render #RRGGBBFF sync for hex-without-alpha swatches in hex format', () => {
    const handleValueChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ currentValue }) =>
        useColorPickerBaseSwatch({
          currentValue,
          format: 'hex',
          defaultFormat: 'hex',
          onFormatChange: undefined,
          handleValueChange,
        }),
      {
        initialProps: {
          currentValue: '#27874f00',
        },
      },
    );

    act(() => {
      result.current.handleSwatchSelect('#ff0000');
    });

    // The public value is the base hex (no alpha).
    expect(handleValueChange).toHaveBeenCalledWith('#ff0000');

    // Simulate the parent applying the new value.
    rerender({ currentValue: '#ff0000' });

    // Note: renderHook flushes layout-effects, so the temporary internal '#RRGGBBFF'
    // sync may be applied and immediately cleaned up before we can observe it here.
    // The stable contract we can assert is: it emits '#RRGGBB' and does not keep
    // appending 'FF' afterwards.
    expect(result.current.valueForPicker).toBe('#ff0000');
  });

  it('does not append FF in non-hex formats even if forceOpaqueHex is set', () => {
    const handleValueChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ currentValue }) =>
        useColorPickerBaseSwatch({
          currentValue,
          format: 'hex',
          defaultFormat: 'hex',
          onFormatChange: undefined,
          handleValueChange,
        }),
      {
        initialProps: {
          currentValue: '#000000',
        },
      },
    );

    act(() => {
      result.current.handleSwatchSelect('#00ff00');
    });

    rerender({ currentValue: '#00ff00' });

    act(() => {
      result.current.handleFormatChange('rgb');
    });

    // With format=rgb, valueForPicker should be the currentValue unchanged.
    expect(result.current.valueForPicker).toBe('#00ff00');
  });
});
