import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerSwatch,
} from '../../../src/components/ui/color-picker';

describe('colorPicker - value parsing', () => {
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
      expect(getByRole('img').getAttribute('aria-label')).toBe('Current color: #ff0000');
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
      expect(getByRole('img').getAttribute('aria-label')).toBe('Current color: #000000');
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
