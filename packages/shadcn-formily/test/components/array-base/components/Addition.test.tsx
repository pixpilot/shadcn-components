/**
 * Tests for ArrayAddition component.
 *
 * The critical behaviour verified here is the autoSave flag routing:
 * - autoSave=undefined (no dialog/popover, e.g. ArrayCards, ArrayCollapse):
 *     item is pushed directly into the array field.
 * - autoSave=true  (dialog/popover with live save):
 *     item is pushed directly, then onAdd notified.
 * - autoSave=false (dialog/popover with manual save, e.g. ArrayDialog default):
 *     item is NOT pushed; instead onAdd is called with draft-only options so
 *     the dialog/popover can show an empty editor before committing.
 *
 * A regression was introduced where the condition was inverted
 * (`if (!autoSave)` → draft-only), which broke ArrayCards / ArrayCollapse.
 */

import type { IArrayBaseContext } from '../../../../src/components/array-base/array-context';
import { useField } from '@formily/react';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArrayBaseContext } from '../../../../src/components/array-base/array-context';
import { ArrayAddition } from '../../../../src/components/array-base/components/Addition';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('@formily/react', () => ({
  useField: vi.fn(),
}));

vi.mock('@pixpilot/shadcn-ui', () => ({
  ButtonExtended: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      disabledTooltip?: unknown;
      fullWidth?: unknown;
    },
  ) => {
    const { children, onClick, disabled } = props;
    return (
      <button data-testid="add-button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  },
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  PlusIcon: () => <span data-testid="plus-icon" />,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockField = {
  pattern: 'editable' as const,
  value: ['item1', 'item2'],
  push: vi.fn().mockResolvedValue(undefined),
  unshift: vi.fn().mockResolvedValue(undefined),
  address: { toString: () => 'items' },
};

function makeContext(
  propsOverride?: Partial<IArrayBaseContext['props']>,
  fieldOverride?: Partial<typeof mockField>,
  schemaOverride?: Partial<IArrayBaseContext['schema']>,
): IArrayBaseContext {
  return {
    field: { ...mockField, ...fieldOverride } as any,
    schema: { ...(schemaOverride ?? {}) } as any,
    props: { ...(propsOverride ?? {}) },
  };
}

function Wrapper({
  ctx,
  children,
}: {
  ctx: IArrayBaseContext | null;
  children: React.ReactNode;
}) {
  if (!ctx) return <>{children}</>;
  return <ArrayBaseContext value={ctx}>{children}</ArrayBaseContext>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('arrayAddition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /*
     * title must be undefined (not '') so the nullish-coalescing chain in
     * ArrayAddition falls through to the 'Add Item' default.
     * title: '' would be treated as a non-null value by ?? and would resolve
     * to an empty label.
     */
    vi.mocked(useField).mockReturnValue({ disabled: false, title: undefined } as any);
  });

  // -------------------------------------------------------------------------
  // Direct-insertion path (autoSave undefined or true) — regression tests
  // -------------------------------------------------------------------------

  describe('direct insertion when autoSave is undefined (default, e.g. ArrayCards)', () => {
    it('calls field.push with the default value', () => {
      const ctx = makeContext({ onAdd: vi.fn() }); // no autoSave → undefined

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.push).toHaveBeenCalledOnce();
    });

    it('calls onAdd without draft-only options', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd }); // autoSave: undefined

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(onAdd).toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ mode: 'draft-only' }),
      );
    });

    it('calls field.unshift and onAdd(0) when method=unshift', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd }); // autoSave: undefined

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition method="unshift" />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.unshift).toHaveBeenCalledOnce();
      expect(mockField.push).not.toHaveBeenCalled();
      expect(onAdd).toHaveBeenCalledWith(0);
    });
  });

  describe('direct insertion when autoSave is true', () => {
    it('calls field.push with the default value', () => {
      const ctx = makeContext({ onAdd: vi.fn(), autoSave: true });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.push).toHaveBeenCalledOnce();
    });

    it('calls onAdd without draft-only options', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, autoSave: true });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(onAdd).toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ mode: 'draft-only' }),
      );
    });

    it('calls field.unshift and onAdd(0) when method=unshift', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, autoSave: true });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition method="unshift" />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.unshift).toHaveBeenCalledOnce();
      expect(mockField.push).not.toHaveBeenCalled();
      expect(onAdd).toHaveBeenCalledWith(0);
    });
  });

  // -------------------------------------------------------------------------
  // Draft-only path (autoSave=false) — dialog / popover mode
  // -------------------------------------------------------------------------

  describe('draft-only mode when autoSave is false (ArrayDialog / ArrayPopover)', () => {
    it('does NOT call field.push', () => {
      const ctx = makeContext({ onAdd: vi.fn(), autoSave: false });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.push).not.toHaveBeenCalled();
    });

    it('calls onAdd with mode=draft-only and method=push', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, autoSave: false });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(onAdd).toHaveBeenCalledWith(
        2, // currentLength (after 2 existing items)
        expect.objectContaining({ mode: 'draft-only', method: 'push' }),
      );
    });

    it('calls onAdd with method=unshift and insertionIndex=0 when method=unshift', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, autoSave: false });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition method="unshift" />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.unshift).not.toHaveBeenCalled();
      expect(onAdd).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ mode: 'draft-only', method: 'unshift' }),
      );
    });

    it('passes initialDraftValue from the defaultValue prop', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, autoSave: false });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition defaultValue={{ name: 'seed' }} />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(onAdd).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ initialDraftValue: { name: 'seed' } }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Visibility guard-rails
  // -------------------------------------------------------------------------

  describe('visibility', () => {
    it('renders nothing when there is no array context', () => {
      render(
        <Wrapper ctx={null}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.queryByTestId('add-button')).toBeNull();
    });

    it('renders nothing when field pattern is readOnly', () => {
      const ctx = makeContext({}, { pattern: 'readOnly' as any });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.queryByTestId('add-button')).toBeNull();
    });

    it('renders nothing when field pattern is readPretty', () => {
      const ctx = makeContext({}, { pattern: 'readPretty' as any });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.queryByTestId('add-button')).toBeNull();
    });

    it('renders when field pattern is disabled (shows but disabled)', () => {
      const ctx = makeContext({}, { pattern: 'disabled' as any });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.getByTestId('add-button')).toBeTruthy();
    });
  });

  // -------------------------------------------------------------------------
  // Disabled / max items
  // -------------------------------------------------------------------------

  describe('disabled state', () => {
    it('does nothing when array.props.disabled is true', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd, disabled: true });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.push).not.toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('shows "Limit Reached" when maxItems is reached', () => {
      const ctx = makeContext({}, { value: ['a', 'b'] }, { maxItems: 2 });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.getByText('Limit Reached (2/2)')).toBeTruthy();
    });

    it('does nothing when maxItems is reached and button is clicked', () => {
      const onAdd = vi.fn();
      const ctx = makeContext({ onAdd }, { value: ['a', 'b'] }, { maxItems: 2 });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      fireEvent.click(screen.getByTestId('add-button'));

      expect(mockField.push).not.toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('shows normal label when below maxItems', () => {
      const ctx = makeContext({}, { value: ['a'] }, { maxItems: 5 });

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition title="Add Row" />
        </Wrapper>,
      );

      expect(screen.queryByText(/Limit Reached/u)).toBeNull();
      expect(screen.getByText('Add Row')).toBeTruthy();
    });
  });

  // -------------------------------------------------------------------------
  // Label / title
  // -------------------------------------------------------------------------

  describe('label resolution', () => {
    it('uses the title prop when provided', () => {
      const ctx = makeContext();

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition title="Custom Title" />
        </Wrapper>,
      );

      expect(screen.getByText('Custom Title')).toBeTruthy();
    });

    it('falls back to "Add Item" when no title is given', () => {
      const ctx = makeContext();

      render(
        <Wrapper ctx={ctx}>
          <ArrayAddition />
        </Wrapper>,
      );

      expect(screen.getByText('Add Item')).toBeTruthy();
    });
  });
});
