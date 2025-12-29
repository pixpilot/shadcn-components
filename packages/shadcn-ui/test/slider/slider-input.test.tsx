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
});
