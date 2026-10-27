/** What the sign-in redirect came back with: a code to exchange, or why there is none. */
export type CallbackParams =
  | { ok: true; code: string; state: string }
  | { ok: false; error: string };

/** Read an OAuth-style sign-in callback URL's query. */
export function readCallbackParams(url: string): CallbackParams {
  const params = new URL(url).searchParams;
  const error = params.get('error');
  if (error !== null) {
    return { ok: false, error: params.get('error_description') ?? error };
  }
  const code = params.get('code') ?? '';
  const state = params.get('state') ?? '';
  if (code === '' || state === '') {
    return { ok: false, error: 'The sign-in link is incomplete. Please sign in again.' };
  }
  return { ok: true, code, state };
}
