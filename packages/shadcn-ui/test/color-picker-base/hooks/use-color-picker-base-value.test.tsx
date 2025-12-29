import { act, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useColorPickerBaseValue } from '../../../src/ColorPickerBase/hooks/use-color-picker-base-value';

function Harness(props: {
  value: string | undefined;
  defaultValue: string;
  onChange: ((value: string) => void) | undefined;
  onValueChange: ((value: string) => void) | undefined;
  onReady: (api: {
    handleValueChange: (value: string) => void;
    getValue: () => string;
  }) => void;
  triggerLayoutCall?: boolean;
  layoutCallValue?: string;
}) {
  const { currentValue, handleValueChange } = useColorPickerBaseValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    onValueChange: props.onValueChange,
  });

  React.useLayoutEffect(() => {
    if (props.triggerLayoutCall) {
      handleValueChange(props.layoutCallValue ?? 'rgb(0, 0, 0)');
    }
  }, [handleValueChange, props.layoutCallValue, props.triggerLayoutCall]);

  React.useEffect(() => {
    props.onReady({
      handleValueChange,
      getValue: () => currentValue,
    });
  }, [currentValue, handleValueChange, props]);

  return null;
}

describe('useColorPickerBaseValue', () => {
  it('uses defaultValue when uncontrolled', async () => {
    let api: any;

    render(
      <Harness
        value={undefined}
        defaultValue="#123456"
        onChange={undefined}
        onValueChange={undefined}
        onReady={(next) => {
          api = next;
        }}
      />,
    );

    expect(api.getValue()).toBe('#123456');
  });

  it('calls onChange/onValueChange once and updates currentValue', async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();

    let api: any;

    render(
      <Harness
        value={undefined}
        defaultValue="#000000"
        onChange={onChange}
        onValueChange={onValueChange}
        onReady={(next) => {
          api = next;
        }}
      />,
    );

    act(() => {
      api.handleValueChange('#ff0000');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('#ff0000');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('#ff0000');
    expect(api.getValue()).toBe('#ff0000');
  });

  it('dedupes repeated notifications of the same value', async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();

    let api: any;

    render(
      <Harness
        value={undefined}
        defaultValue="#000000"
        onChange={onChange}
        onValueChange={onValueChange}
        onReady={(next) => {
          api = next;
        }}
      />,
    );

    act(() => {
      api.handleValueChange('#ff0000');
      api.handleValueChange('#ff0000');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(api.getValue()).toBe('#ff0000');
  });

  it('ignores value changes during a controlled prop sync (layout-effect timing)', async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Harness
        value="#111111"
        defaultValue="#000000"
        onChange={onChange}
        onValueChange={onValueChange}
        onReady={() => {
          // no-op
        }}
      />,
    );

    rerender(
      <Harness
        value="#222222"
        defaultValue="#000000"
        onChange={onChange}
        onValueChange={onValueChange}
        onReady={() => {
          // no-op
        }}
        triggerLayoutCall
        layoutCallValue="#333333"
      />,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
