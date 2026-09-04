import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SliderInput } from '../../src/slider/SliderInput';

describe('slider-input', () => {
  it('reflects controlled value changes in the input', () => {
    const { rerender } = render(
      <SliderInput value={[10]} onValueChange={() => {}} min={0} max={100} />,
    );

    const input = screen.getByRole('spinbutton') as unknown as HTMLInputElement;
    expect(input.value).toBe('10');

    rerender(<SliderInput value={[25]} onValueChange={() => {}} min={0} max={100} />);

    expect(input.value).toBe('25');
  });

  it('updates internal value when uncontrolled and input changes', () => {
    const onValueChange = vi.fn();

    render(<SliderInput defaultValue={[10]} onValueChange={onValueChange} />);

    const input = screen.getByRole('spinbutton') as unknown as HTMLInputElement;
    expect(input.value).toBe('10');

    fireEvent.change(input, { target: { value: '15' } });

    expect(onValueChange).toHaveBeenCalledWith([15]);
    expect(input.value).toBe('15');
  });

  it('uses slider bounds for the input by default', () => {
    render(<SliderInput defaultValue={[10]} min={5} max={100} />);

    const input = screen.getByRole('spinbutton') as unknown as HTMLInputElement;

    expect(input.min).toBe('5');
    expect(input.max).toBe('100');
  });

  it('allows the input bounds to override and remove the slider bounds', () => {
    const onValueChange = vi.fn();

    render(
      <SliderInput
        defaultValue={[10]}
        min={0}
        max={100}
        input={{ min: undefined, max: undefined }}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('spinbutton') as unknown as HTMLInputElement;

    expect(input.getAttribute('min')).toBeNull();
    expect(input.getAttribute('max')).toBeNull();

    fireEvent.change(input, { target: { value: '-20' } });

    expect(onValueChange).toHaveBeenCalledWith([-20]);
    expect(input.value).toBe('-20');
    expect(screen.getByRole('slider').getAttribute('aria-valuemin')).toBe('-20');
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('-20');

    fireEvent.change(input, { target: { value: '20000' } });

    expect(onValueChange).toHaveBeenCalledWith([20000]);
    expect(input.value).toBe('20000');
    expect(screen.getByRole('slider').getAttribute('aria-valuemin')).toBe('-20');
    expect(screen.getByRole('slider').getAttribute('aria-valuemax')).toBe('20000');
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('20000');

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });

    expect(screen.getByRole('slider').getAttribute('aria-valuemax')).toBe('20000');
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('19999');

    fireEvent.change(input, { target: { value: '50' } });

    expect(screen.getByRole('slider').getAttribute('aria-valuemin')).toBe('-20');
    expect(screen.getByRole('slider').getAttribute('aria-valuemax')).toBe('20000');
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('50');
  });

  it('keeps the supplied slider maximum when auto expansion is disabled', () => {
    render(
      <SliderInput
        autoExpandMax={false}
        defaultValue={[10]}
        min={0}
        max={100}
        input={{ max: undefined }}
      />,
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '20000' } });

    expect(screen.getByRole('slider').getAttribute('aria-valuemax')).toBe('100');
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('100');
  });
});
