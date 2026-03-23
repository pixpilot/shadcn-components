/**
 * Regression tests for custom modifications to the shadcn/ui Dialog component.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THESE TESTS EXIST
 * ─────────────────────────────────────────────────────────────────────────────
 * The `packages/shadcn` folder is not auto-updated — components are copied in
 * manually from the upstream shadcn/ui CLI:
 *
 *   npx shadcn@latest add dialog
 *
 * That command OVERWRITES `dialog.tsx` with the upstream version, which does
 * NOT include the `container` prop.  After every such update you MUST re-apply
 * the customisation documented below before committing.
 *
 * The tests here act as a safety net: they will fail after an upstream update,
 * making the missing re-application immediately obvious in CI.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT WAS CUSTOMISED
 * ─────────────────────────────────────────────────────────────────────────────
 * `DialogContent` was extended with an optional `container?: HTMLElement | null`
 * prop.  When supplied:
 *
 *   1. The Radix `DialogPortal` mounts into that element instead of
 *      `document.body`, scoping the dialog's DOM subtree.
 *   2. The overlay class is switched from `fixed` to `absolute` so it fills
 *      the container rather than the whole viewport.
 *   3. The content class is similarly switched from `fixed` to `absolute` so
 *      it centres within the container.
 *   4. `preventBackdropClickClose` prevents the dialog from closing when the
 *      overlay is clicked, while keeping the default backdrop-close behavior
 *      intact when the prop is omitted.
 *
 * To restore after an upstream update, apply the following diff to the newly
 * copied `dialog.tsx`:
 *
 *   - Add `container?: HTMLElement | null` to the `DialogContent` prop type.
 *   - Destructure `container` from props before the spread.
 *   - Pass `container={container ?? undefined}` to `<DialogPortal>`.
 *   - Pass `className={container ? 'absolute' : undefined}` to `<DialogOverlay>`.
 *   - Add `container && 'absolute'` to the `cn(...)` call on
 *     `<DialogPrimitive.Content>` (before the consumer `className`).
 *   - Destructure `onInteractOutside` and prevent default when
 *     `preventBackdropClickClose` is true.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../src/components/ui/dialog';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders an open Dialog with a container prop so we can inspect the produced
 * DOM without needing user interaction.
 */
function renderOpenDialog(container?: HTMLElement | null) {
  return render(
    <Dialog open>
      <DialogContent container={container} aria-describedby={undefined}>
        <DialogTitle>Test Dialog</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogContent>
    </Dialog>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('dialogContent — container prop (custom, restore after shadcn update)', () => {
  it('accepts the container prop without throwing', () => {
    /*
     * The simplest smoke-test: if the upstream update removed the prop,
     * TypeScript would already catch it at compile-time, but this runtime
     * check also exercises the render path.
     */
    expect(() => renderOpenDialog()).not.toThrow();
    expect(() => renderOpenDialog(null)).not.toThrow();
  });

  it('renders content into document.body when no container is provided', () => {
    /*
     * Default (upstream) behaviour must be preserved — the dialog should be
     * appended to document.body via the Radix portal.
     */
    renderOpenDialog();
    const content = document.querySelector('[data-slot="dialog-content"]');
    expect(content).not.toBeNull();
    // Overlay and content must NOT carry the absolute override class
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay?.className).toContain('fixed');
    expect(overlay?.className).not.toContain('absolute');
    expect(content?.className).toContain('fixed');
    expect(content?.className).not.toContain('absolute');
  });

  it('mounts the portal inside the given container element', () => {
    /*
     * CUSTOM BEHAVIOUR — restore this after every shadcn update.
     *
     * When `container` is provided, Radix DialogPortal must render its DOM
     * children inside that element instead of document.body.
     */
    const containerEl = document.createElement('div');
    document.body.appendChild(containerEl);

    renderOpenDialog(containerEl);

    const content = containerEl.querySelector('[data-slot="dialog-content"]');
    expect(content).not.toBeNull();

    document.body.removeChild(containerEl);
  });

  it('applies absolute positioning to the overlay when a container is provided', () => {
    /*
     * CUSTOM BEHAVIOUR — restore this after every shadcn update.
     *
     * The overlay must use `absolute` (not `fixed`) so it is clipped to the
     * container element.  `tailwind-merge` resolves the conflict by letting
     * the later class win, so the resulting className must contain `absolute`
     * and must NOT contain `fixed`.
     */
    const containerEl = document.createElement('div');
    document.body.appendChild(containerEl);

    renderOpenDialog(containerEl);

    const overlay = containerEl.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).not.toBeNull();
    expect(overlay?.className).toContain('absolute');
    expect(overlay?.className).not.toContain('fixed');

    document.body.removeChild(containerEl);
  });

  it('applies absolute positioning to the content when a container is provided', () => {
    /*
     * CUSTOM BEHAVIOUR — restore this after every shadcn update.
     *
     * The dialog content must use `absolute` positioning so it centres inside
     * the container instead of the viewport.
     */
    const containerEl = document.createElement('div');
    document.body.appendChild(containerEl);

    renderOpenDialog(containerEl);

    const content = containerEl.querySelector('[data-slot="dialog-content"]');
    expect(content).not.toBeNull();
    expect(content?.className).toContain('absolute');
    expect(content?.className).not.toContain('fixed');

    document.body.removeChild(containerEl);
  });
});

describe('dialogContent — unchanged upstream behaviour', () => {
  it('renders inside the document when open is true', () => {
    renderOpenDialog();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });
});
