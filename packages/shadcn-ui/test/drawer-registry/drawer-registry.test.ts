import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drawer, registerDrawer, showDrawer } from '../../src/drawer-registry';

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

interface ExampleDrawerProps extends NiceModalHocProps {
  count: number;
  message: string;
  tone?: 'default' | 'warning';
}

const ExampleDrawer: React.FC<ExampleDrawerProps> = () => null;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('drawer-registry helpers', () => {
  it('registers a drawer and returns a controller for show, hide, and remove', async () => {
    const defaultProps = {
      message: 'Saved as default',
      tone: 'default' as const,
    };
    const controller = registerDrawer('example-drawer', ExampleDrawer, defaultProps);
    niceModalMocks.show.mockResolvedValueOnce('resolved');
    niceModalMocks.hide.mockResolvedValueOnce('hidden');

    await expect(controller.show<string>({ count: 1 })).resolves.toBe('resolved');
    await expect(controller.hide<string>()).resolves.toBe('hidden');
    controller.remove();

    expect(controller.id).toBe('example-drawer');
    expect(niceModalMocks.register).toHaveBeenCalledWith(
      'example-drawer',
      expect.any(Function),
      defaultProps,
    );
    expect(niceModalMocks.show).toHaveBeenCalledWith('example-drawer', { count: 1 });
    expect(niceModalMocks.hide).toHaveBeenCalledWith('example-drawer');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('example-drawer');
  });

  it('shows a registered drawer by id with generic props', async () => {
    niceModalMocks.show.mockResolvedValueOnce(true);

    await expect(
      showDrawer<boolean>('example-drawer', {
        count: 2,
        message: 'Shown by id',
      }),
    ).resolves.toBe(true);

    expect(niceModalMocks.show).toHaveBeenCalledWith('example-drawer', {
      count: 2,
      message: 'Shown by id',
    });
  });

  it('exposes id-based helpers through the drawer registry object', async () => {
    const controller = drawer.register('registry-drawer', ExampleDrawer, {
      message: 'Registry default',
    });
    niceModalMocks.show.mockResolvedValueOnce('shown');
    niceModalMocks.hide.mockResolvedValueOnce('hidden');

    await expect(drawer.show<string>('registry-drawer', { count: 3 })).resolves.toBe(
      'shown',
    );
    await expect(drawer.hide<string>('registry-drawer')).resolves.toBe('hidden');
    drawer.remove('registry-drawer');
    drawer.unregister('registry-drawer');

    expect(controller.id).toBe('registry-drawer');
    expect(niceModalMocks.register).toHaveBeenCalledWith(
      'registry-drawer',
      expect.any(Function),
      { message: 'Registry default' },
    );
    expect(niceModalMocks.show).toHaveBeenCalledWith('registry-drawer', { count: 3 });
    expect(niceModalMocks.hide).toHaveBeenCalledWith('registry-drawer');
    expect(niceModalMocks.remove).toHaveBeenCalledWith('registry-drawer');
    expect(niceModalMocks.unregister).toHaveBeenCalledWith('registry-drawer');
  });
});
