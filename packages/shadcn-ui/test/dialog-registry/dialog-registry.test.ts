import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dialog, registerDialog, showDialog } from '../../src/dialog-registry';

const niceModalMocks = vi.hoisted(() => ({
  create: vi.fn((component) => component),
  hide: vi.fn(),
  register: vi.fn(),
  remove: vi.fn(),
  show: vi.fn(),
  useModal: vi.fn(),
  unregister: vi.fn(),
}));

vi.mock('@ebay/nice-modal-react', () => ({
  default: niceModalMocks,
  create: niceModalMocks.create,
  useModal: niceModalMocks.useModal,
  unregister: niceModalMocks.unregister,
}));

interface ExampleDialogProps extends NiceModalHocProps {
  count: number;
  message: string;
  tone?: 'default' | 'warning';
}

const ExampleDialog: React.FC<ExampleDialogProps> = () => null;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('dialog-registry helpers', () => {
  it('registers a dialog and returns a controller for show, hide, and remove', async () => {
    const defaultProps = {
      message: 'Saved as default',
      tone: 'default' as const,
    };
    const controller = registerDialog('example-dialog', ExampleDialog, defaultProps);
    niceModalMocks.show.mockResolvedValueOnce('resolved');
    niceModalMocks.hide.mockResolvedValueOnce('hidden');

    await expect(controller.show<string>({ count: 1 })).resolves.toBe('resolved');
    await expect(controller.hide<string>()).resolves.toBe('hidden');
    controller.remove();

    expect(controller.id).toBe('example-dialog');
    expect(niceModalMocks.register).toHaveBeenCalledWith(
      'example-dialog',
      expect.any(Function),
      defaultProps,
    );
    expect(niceModalMocks.show).toHaveBeenCalledWith('example-dialog', { count: 1 });
    expect(niceModalMocks.hide).toHaveBeenCalledWith('example-dialog');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('example-dialog');
  });

  it('shows a registered dialog by id with generic props', async () => {
    niceModalMocks.show.mockResolvedValueOnce(true);

    await expect(
      showDialog<boolean>('example-dialog', {
        count: 2,
        message: 'Shown by id',
      }),
    ).resolves.toBe(true);

    expect(niceModalMocks.show).toHaveBeenCalledWith('example-dialog', {
      count: 2,
      message: 'Shown by id',
    });
  });

  it('exposes id-based helpers through the dialog registry object', async () => {
    const controller = dialog.register('registry-dialog', ExampleDialog, {
      message: 'Registry default',
    });
    niceModalMocks.show.mockResolvedValueOnce('shown');
    niceModalMocks.hide.mockResolvedValueOnce('hidden');

    await expect(dialog.show<string>('registry-dialog', { count: 3 })).resolves.toBe(
      'shown',
    );
    await expect(dialog.hide<string>('registry-dialog')).resolves.toBe('hidden');
    dialog.remove('registry-dialog');
    dialog.unregister('registry-dialog');

    expect(controller.id).toBe('registry-dialog');
    expect(niceModalMocks.register).toHaveBeenCalledWith(
      'registry-dialog',
      expect.any(Function),
      { message: 'Registry default' },
    );
    expect(niceModalMocks.show).toHaveBeenCalledWith('registry-dialog', { count: 3 });
    expect(niceModalMocks.hide).toHaveBeenCalledWith('registry-dialog');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('registry-dialog');
    expect(niceModalMocks.unregister).toHaveBeenCalledWith('registry-dialog');
  });
});
