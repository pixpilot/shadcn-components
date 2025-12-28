import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerContent,
  ColorPickerSwatch,
} from '../../../src/components/ui/color-picker';

describe('colorPicker - value parsing', () => {
  it('should emit 8-digit hex when alpha changes in hex format (controlled regression)', () => {
    /*
     * Why this exists:
     * - The upstream https://www.diceui.com/docs/components/color-picker#colorpicker ColorPicker serializes `hex` as `#RRGGBB` only.
     * - If you change alpha via the alpha slider, the RGB part does not change,
     *   so the emitted value string stays the same.
     * - In controlled mode, parents often rely on `onValueChange` to receive a
     *   *different* value; if it never changes, the alpha slider appears to do
     *   nothing.
     *
     * Our minimal deviation:
     * - When format is `hex` and alpha < 1, we emit `#RRGGBBAA` so alpha changes
     *   round-trip and propagate correctly.
     */
    const onValueChange = vi.fn();

    const { getByRole } = render(
      <ColorPicker
        defaultValue="#ff0000"
        defaultFormat="hex"
        onValueChange={onValueChange}
        inline
      >
        <ColorPickerContent>
          <ColorPickerAlphaSlider />
        </ColorPickerContent>
      </ColorPicker>,
    );

    const slider = getByRole('slider');
    slider.focus();
    fireEvent.keyDown(slider, { key: 'ArrowLeft', code: 'ArrowLeft' });

    expect(onValueChange).toHaveBeenCalled();
    const lastValue = onValueChange.mock.calls.at(-1)?.[0] as string | undefined;
    expect(lastValue).toMatch(/^#ff0000[0-9a-f]{2}$/i);
  });

  it('should parse valid color string and update internal state', async () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ColorPicker value="#ff0000" onValueChange={onValueChange} inline>
        <ColorPickerContent>
          <ColorPickerSwatch />
        </ColorPickerContent>
      </ColorPicker>,
    );

    await waitFor(() => {
      expect(getByRole('img').getAttribute('aria-label')).toBe('Current color: #ff0000');
    });
  });

  it('should parse 8-digit hex with alpha and apply transparency', async () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ColorPicker value="#ff000080" onValueChange={onValueChange} inline>
        <ColorPickerContent>
          <ColorPickerSwatch />
        </ColorPickerContent>
      </ColorPicker>,
    );

    await waitFor(() => {
      // In hex format with alpha, the label is 8-digit hex.
      expect(getByRole('img').getAttribute('aria-label')).toBe(
        'Current color: #ff000080',
      );
      expect(getByRole('img').getAttribute('style') ?? '').toContain(
        'rgba(255, 0, 0, 0.',
      );
    });
  });

  it('should fallback to default color with preserved alpha when parsing invalid color string', async () => {
    const onValueChange = vi.fn();
    const { rerender, getByRole } = render(
      <ColorPicker value="rgba(255, 0, 0, 0.5)" onValueChange={onValueChange} inline>
        <ColorPickerContent>
          <ColorPickerSwatch />
        </ColorPickerContent>
      </ColorPicker>,
    );

    await waitFor(() => {
      expect(getByRole('img').getAttribute('aria-label')).toBe(
        'Current color: #ff000080',
      );
    });

    // Now change to an invalid value
    rerender(
      <ColorPicker value="invalid-color" onValueChange={onValueChange} inline>
        <ColorPickerContent>
          <ColorPickerSwatch />
        </ColorPickerContent>
      </ColorPicker>,
    );

    await waitFor(() => {
      expect(getByRole('img').getAttribute('aria-label')).toBe(
        'Current color: #00000080',
      );
      // Preserve previous alpha (0.5) even when value is invalid.
      expect(getByRole('img').getAttribute('style') ?? '').toContain(
        'rgba(0, 0, 0, 0.5)',
      );
    });
  });

  it('should not emit onValueChange while syncing a controlled HSL value prop', async () => {
    // Regression test: If onValueChange is emitted during controlled value syncing,
    // it can create a feedback loop with the parent component, leading to
    // "Maximum update depth exceeded" errors in React. This is especially problematic
    // in HSL format where string round-tripping (hsl(...) -> rgb -> hsl(...)) can
    // produce slightly different serialized values during fast pointer movements.
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ColorPicker value="hsl(0, 100%, 50%)" onValueChange={onValueChange} inline>
        <ColorPickerContent>
          <ColorPickerSwatch />
        </ColorPickerContent>
      </ColorPicker>,
    );

    await waitFor(() => {
      expect(getByRole('img').getAttribute('aria-label')).toBe('Current color: #ff0000');
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
