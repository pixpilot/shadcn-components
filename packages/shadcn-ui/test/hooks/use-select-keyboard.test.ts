import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSelectKeyboard } from '../../src/hooks/use-select-keyboard';

interface TestOption {
  id: string;
  name: string;
}

describe('useSelectKeyboard', () => {
  const mockOptions: TestOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  const getValue = (option: TestOption) => option.id;

  it('does not handle keyboard events when keyboardMode is dropdown', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange,
        keyboardMode: 'dropdown',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('does not handle keyboard events when dropdown is open', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: true,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('does not handle non-arrow keys', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('does not handle keyboard events when options is empty', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: [],
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('does not handle keyboard events when options is undefined', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: undefined,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('cycles to next option with ArrowDown', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('2');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('cycles to previous option with ArrowUp', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '2',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('1');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('cycles from first to last option with ArrowUp', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('3');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('cycles from last to first option with ArrowDown', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '3',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('1');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('starts from first option when current value is not found', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: 'non-existent',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('1');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('starts from last option when current value is not found and ArrowUp is pressed', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: 'non-existent',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('3');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('does not call onChange when next value is same as current value', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    // Single option array
    const singleOption = [{ id: '1', name: 'Only Option' }];

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: singleOption,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('does not call onChange when getValue returns empty string', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const optionsWithEmptyValue = [
      { id: '', name: 'Empty ID' },
      { id: '2', name: 'Valid ID' },
    ];

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: optionsWithEmptyValue,
        value: '1',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('works with different option types', () => {
    const onChange = vi.fn();
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    // Test with string options
    const stringOptions = ['red', 'blue', 'green'];

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: stringOptions,
        value: 'red',
        onChange,
        keyboardMode: 'cycle',
        open: false,
        getValue: (option) => option, // option is already a string
      }),
    );

    act(() => {
      result.current.handleTriggerKeyDown(mockEvent);
    });

    expect(onChange).toHaveBeenCalledWith('blue');
  });

  it('handles undefined onChange callback', () => {
    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any;

    const { result } = renderHook(() =>
      useSelectKeyboard({
        options: mockOptions,
        value: '1',
        onChange: undefined,
        keyboardMode: 'cycle',
        open: false,
        getValue,
      }),
    );

    // Should not throw error
    expect(() => {
      act(() => {
        result.current.handleTriggerKeyDown(mockEvent);
      });
    }).not.toThrow();

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
