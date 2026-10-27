import { render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AuthCallbackScreen } from '../src/components/AuthCallbackScreen';
import { useAuthCallback } from '../src/hooks/use-auth-callback';

const CALLBACK_URL = 'chrome-extension://abc/views/auth-callback.html';

function Callback(props: Parameters<typeof useAuthCallback>[0]) {
  return <AuthCallbackScreen status={useAuthCallback(props)} />;
}

describe('useAuthCallback', () => {
  it('should exchange the code once, even in Strict Mode', async () => {
    const exchangeCode = vi.fn(async () => undefined);
    const onDone = vi.fn();
    render(
      <StrictMode>
        <Callback
          url={`${CALLBACK_URL}?code=c&state=s`}
          exchangeCode={exchangeCode}
          onDone={onDone}
          closeDelayMs={0}
        />
      </StrictMode>,
    );

    expect(await screen.findByText(/You are signed in/u)).toBeTruthy();
    expect(exchangeCode).toHaveBeenCalledExactlyOnceWith({ code: 'c', state: 's' });
    await vi.waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
  });

  it('should show why the exchange failed', async () => {
    render(
      <Callback
        url={`${CALLBACK_URL}?code=c&state=s`}
        exchangeCode={async () => Promise.reject(new Error('Auth code has expired'))}
      />,
    );

    expect((await screen.findByRole('alert')).textContent).toBe('Auth code has expired');
  });

  it('should not exchange anything when the redirect carries an error', async () => {
    const exchangeCode = vi.fn(async () => undefined);
    render(
      <Callback
        url={`${CALLBACK_URL}?error=access_denied`}
        exchangeCode={exchangeCode}
      />,
    );

    expect((await screen.findByRole('alert')).textContent).toBe('access_denied');
    expect(exchangeCode).not.toHaveBeenCalled();
  });

  it('should show the loading state until the exchange settles', () => {
    render(
      <Callback
        url={`${CALLBACK_URL}?code=c&state=s`}
        exchangeCode={async () =>
          new Promise<void>(() => {
            // Never settles.
          })
        }
      />,
    );

    expect(screen.getByText('Signing you in…')).toBeTruthy();
  });
});
