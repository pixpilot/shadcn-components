import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import type React from 'react';
import type { RegisteredDialogShowProps } from '../../src/dialog-provider';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
  dialog,
  hideDialog,
  registerDialog,
  removeDialog,
  showDialog,
  unregisterDialog,
} from '../../src/dialog-provider';

const niceModalMocks = vi.hoisted(() => ({
  hide: vi.fn(),
  register: vi.fn(),
  remove: vi.fn(),
  show: vi.fn(),
  unregister: vi.fn(),
}));

vi.mock('@ebay/nice-modal-react', () => ({
  default: niceModalMocks,
  unregister: niceModalMocks.unregister,
}));

interface ExampleDialogProps extends NiceModalHocProps {
  count: number;
  message: string;
  tone?: 'default' | 'warning';
}

const ExampleDialog: React.FC<ExampleDialogProps> = () => null;

describe('dialog-provider helpers', () => {
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
      ExampleDialog,
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
      ExampleDialog,
      { message: 'Registry default' },
    );
    expect(niceModalMocks.show).toHaveBeenCalledWith('registry-dialog', { count: 3 });
    expect(niceModalMocks.hide).toHaveBeenCalledWith('registry-dialog');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('registry-dialog');
    expect(niceModalMocks.unregister).toHaveBeenCalledWith('registry-dialog');
  });

  it('exposes named id-based hide, remove, and unregister helpers', async () => {
    niceModalMocks.hide.mockResolvedValueOnce('hidden');

    await expect(hideDialog<string>('named-dialog')).resolves.toBe('hidden');
    removeDialog('named-dialog');
    unregisterDialog('named-dialog');

    expect(niceModalMocks.hide).toHaveBeenCalledWith('named-dialog');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('named-dialog');
    expect(niceModalMocks.unregister).toHaveBeenCalledWith('named-dialog');
  });

  it('keeps registered dialog props typed and makes default props optional', () => {
    type ShowProps = RegisteredDialogShowProps<ExampleDialogProps, { message: string }>;

    expectTypeOf<ShowProps>().toMatchTypeOf<{
      count: number;
      id?: string;
      defaultVisible?: boolean;
      keepMounted?: boolean;
      message?: string;
      tone?: 'default' | 'warning';
    }>();

    const controller = registerDialog('typed-dialog', ExampleDialog, {
      message: 'Default message',
    });
    const registryController = dialog.register('typed-registry-dialog', ExampleDialog, {
      message: 'Default message',
    });

    expectTypeOf(controller.show).parameter(0).toMatchTypeOf<
      | {
          count: number;
          message?: string;
          tone?: 'default' | 'warning';
        }
      | undefined
    >();
    expectTypeOf(registryController.show).parameter(0).toMatchTypeOf<
      | {
          count: number;
          message?: string;
          tone?: 'default' | 'warning';
        }
      | undefined
    >();
  });
});
