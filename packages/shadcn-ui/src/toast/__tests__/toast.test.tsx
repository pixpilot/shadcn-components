import React from 'react';
import * as sonner from 'sonner';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from '../toast';

vi.mock('sonner', () => {
  const custom = vi.fn();
  const dismiss = vi.fn();
  return {
    toast: {
      custom,
      dismiss,
    },
  };
});

describe('toast', () => {
  beforeEach(() => {
    (sonner.toast.custom as any).mockClear();
  });

  it('passes variant and options for string messages', () => {
    const returnedId = toast.success('Hello world', {
      id: 'my-id',
      duration: 1234,
      dismissible: true,
      position: 'top-center',
    });

    expect(returnedId).toBe('my-id');

    expect(sonner.toast.custom as any).toHaveBeenCalledTimes(1);

    const call = (sonner.toast.custom as any).mock.calls[0];
    const renderFn = call[0];
    const opts = call[1];

    expect(opts.duration).toBe(1234);
    expect(opts.position).toBe('top-center');
    expect(opts.id).toBe('my-id');

    const element = renderFn({ id: opts.id });
    expect(element.props.variant).toBe('success');
    expect(element.props.description).toBe('Hello world');
  });

  it('toast.custom passes options through without id suffix', () => {
    const comp = React.createElement('div', { 'data-testid': 'x' }, 'X');
    (sonner.toast.custom as any).mockReturnValue('mocked-id');
    const returnedId = toast.custom(comp, {
      id: 'custom-id',
      duration: 2000,
      position: 'bottom-center',
    });

    expect(returnedId).toBe('mocked-id');

    expect(sonner.toast.custom as any).toHaveBeenCalledTimes(1);
    const call = (sonner.toast.custom as any).mock.calls[0];
    const renderFn = call[0];
    const opts = call[1];

    expect(opts.id).toBe('custom-id');
    expect(opts.duration).toBe(2000);

    const returned = renderFn();
    expect(returned).toBe(comp);
  });
});
