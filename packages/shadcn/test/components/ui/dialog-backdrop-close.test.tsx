import * as React from 'react';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DialogContent } from '../../../src/components/ui/dialog';

const onContentProps = vi.fn();

vi.mock('@radix-ui/react-dialog', () => {
  const passthrough = ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  );

  return {
    Root: passthrough,
    Trigger: passthrough,
    Portal: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => (
      <>{children}</>
    ),
    Close: passthrough,
    Overlay: passthrough,
    Content: ({
      children,
      onPointerDownOutside,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      onContentProps({ ...props, onPointerDownOutside });
      return <div {...props}>{children}</div>;
    },
    Title: passthrough,
    Description: passthrough,
  };
});

describe('dialogContent — preventBackdropClickClose prop', () => {
  beforeEach(() => {
    onContentProps.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('preserves the default backdrop-dismiss behavior when omitted', () => {
    /*
     * Why this exists:
     * - The new prop must be opt-in only.
     * - When it is omitted, `DialogContent` should leave the Radix outside
     *   pointer-down behavior unchanged.
     * - This test catches accidental regressions when re-applying custom dialog
     *   changes after updating from upstream shadcn/ui.
     */
    render(
      <DialogContent aria-describedby={undefined} showCloseButton={false}>
        <div>Body</div>
      </DialogContent>,
    );

    const props = onContentProps.mock.calls[0]?.[0] as {
      onPointerDownOutside?: (event: { preventDefault: () => void }) => void;
    };
    const preventDefault = vi.fn();

    props.onPointerDownOutside?.({ preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('prevents outside clicks from closing a container-scoped dialog', () => {
    /*
     * Why this exists:
     * - When a container is provided, outside clicks should close only if the
     *   pointer interaction started inside that container.
     * - This test protects the custom container scoping logic from being lost
     *   when the dialog source is updated from upstream shadcn/ui.
     */
    const container = document.createElement('div');
    const insideTarget = document.createElement('button');
    const outsideTarget = document.createElement('button');
    container.appendChild(insideTarget);

    render(
      <DialogContent
        container={container}
        aria-describedby={undefined}
        showCloseButton={false}
      >
        <div>Body</div>
      </DialogContent>,
    );

    const props = onContentProps.mock.calls[0]?.[0] as {
      onPointerDownOutside?: (event: {
        target: EventTarget | null;
        preventDefault: () => void;
      }) => void;
    };

    const preventDefaultOutside = vi.fn();
    props.onPointerDownOutside?.({
      target: outsideTarget,
      preventDefault: preventDefaultOutside,
    });
    expect(preventDefaultOutside).toHaveBeenCalledTimes(1);

    const preventDefaultInside = vi.fn();
    props.onPointerDownOutside?.({
      target: insideTarget,
      preventDefault: preventDefaultInside,
    });
    expect(preventDefaultInside).not.toHaveBeenCalled();
  });

  it('prevents backdrop dismissal when the flag is enabled', () => {
    /*
     * Why this exists:
     * - `preventBackdropClickClose` is the custom opt-out that keeps the
     *   dialog open on backdrop clicks.
     * - This assertion documents the intended override so it is restored if
     *   the base shadcn dialog is refreshed later.
     */
    render(
      <DialogContent
        aria-describedby={undefined}
        disableOutsideClick
        showCloseButton={false}
      >
        <div>Body</div>
      </DialogContent>,
    );

    const props = onContentProps.mock.calls[0]?.[0] as {
      onPointerDownOutside?: (event: { preventDefault: () => void }) => void;
    };
    const preventDefault = vi.fn();

    props.onPointerDownOutside?.({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});
