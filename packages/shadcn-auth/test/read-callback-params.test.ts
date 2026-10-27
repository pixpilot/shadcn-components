import { describe, expect, it } from 'vitest';
import { readCallbackParams } from '../src/utils/read-callback-params';

const CALLBACK_URL = 'chrome-extension://abc/views/auth-callback.html';

describe('readCallbackParams', () => {
  it('should read the code and state', () => {
    expect(readCallbackParams(`${CALLBACK_URL}?code=the-code&state=the-state`)).toEqual({
      ok: true,
      code: 'the-code',
      state: 'the-state',
    });
  });

  it('should report the error the redirect sent back', () => {
    expect(
      readCallbackParams(`${CALLBACK_URL}?error=access_denied&error_description=Denied`),
    ).toEqual({ ok: false, error: 'Denied' });
    expect(readCallbackParams(`${CALLBACK_URL}?error=access_denied`)).toEqual({
      ok: false,
      error: 'access_denied',
    });
  });

  it('should report a missing code or state', () => {
    expect(readCallbackParams(`${CALLBACK_URL}?code=the-code`)).toMatchObject({
      ok: false,
    });
    expect(readCallbackParams(CALLBACK_URL)).toMatchObject({ ok: false });
  });
});
