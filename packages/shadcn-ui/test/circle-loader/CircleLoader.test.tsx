import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CircleLoader } from '../../src/circle-loader';

describe('circleLoader', () => {
  it('hydrates server HTML without a mismatch', async () => {
    const html = renderToString(<CircleLoader colors={['red', 'blue']} />);
    const container = document.createElement('div');
    container.innerHTML = html;
    const onRecoverableError = vi.fn();

    await act(async () => {
      hydrateRoot(container, <CircleLoader colors={['red', 'blue']} />, {
        onRecoverableError,
      });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it('names its keyframes with a valid CSS identifier', () => {
    const html = renderToString(<CircleLoader />);
    const name = /@keyframes (?<name>\S+)/u.exec(html)?.groups?.name;

    expect(name).toMatch(/^spinner-[\w-]+-rotate$/u);
  });
});
