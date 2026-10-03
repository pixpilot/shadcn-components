import type { TypeToConfirmDialogProps } from '../../src/type-to-confirm-dialog';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayProvider } from '../../src/overlay-provider';
import { typeToConfirmDialog } from '../../src/type-to-confirm-dialog';

interface OpenedDialog {
  /** Settles when the dialog closes: `true` on confirm, `false` on cancel. */
  result: Promise<boolean>;
}

function openDialog(props: Partial<TypeToConfirmDialogProps> = {}): OpenedDialog {
  render(<OverlayProvider>{null}</OverlayProvider>);

  let result: Promise<boolean> = Promise.resolve(false);
  act(() => {
    result = typeToConfirmDialog.show({
      title: 'Delete account',
      description: 'Removes everything.',
      confirmWord: 'DELETE',
      confirmText: 'Delete',
      pendingText: 'Deleting...',
      ...props,
    });
  });

  return { result };
}

function button(name: RegExp | string): HTMLButtonElement {
  return screen.getByRole<HTMLButtonElement>('button', { name });
}

function confirmButton(): HTMLButtonElement {
  return button(/delete|deleting/iu);
}

function typeWord(value: string) {
  fireEvent.change(screen.getByRole('textbox'), { target: { value } });
}

afterEach(() => {
  act(() => {
    typeToConfirmDialog.remove();
  });
});

describe('typeToConfirmDialog', () => {
  it('should keep confirm disabled until the exact word is typed', async () => {
    openDialog();

    expect(await screen.findByText('Removes everything.')).toBeTruthy();
    expect(confirmButton().disabled).toBe(true);

    typeWord('delete');
    expect(confirmButton().disabled).toBe(true);

    typeWord('DELETE');
    expect(confirmButton().disabled).toBe(false);
  });

  it('should label the input with the confirm word', async () => {
    openDialog();

    expect(await screen.findByLabelText(/type delete to confirm/iu)).toBeTruthy();
  });

  it('should await onConfirm and resolve true once it settles', async () => {
    let finish: () => void = () => undefined;
    const onConfirm = vi.fn(
      async () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { result } = openDialog({ onConfirm });

    await screen.findByRole('textbox');
    typeWord('DELETE');
    fireEvent.click(confirmButton());

    expect(await screen.findByText('Deleting...')).toBeTruthy();
    expect(button('Cancel').disabled).toBe(true);

    await act(async () => {
      finish();
    });

    await expect(result).resolves.toBe(true);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should stay open and re-enable when onConfirm rejects', async () => {
    const onConfirm = vi.fn(async () => Promise.reject(new Error('nope')));
    openDialog({ onConfirm });

    await screen.findByRole('textbox');
    typeWord('DELETE');
    fireEvent.click(confirmButton());

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(confirmButton().disabled).toBe(false));
    expect(screen.getByText('Delete account')).toBeTruthy();
  });

  it('should resolve false and call onCancel when cancelled', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const { result } = openDialog({ onCancel, onConfirm });

    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    await expect(result).resolves.toBe(false);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
