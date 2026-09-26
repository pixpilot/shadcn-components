'use client';

import type React from 'react';

export interface LegalNoticeProps {
  privacyPolicyUrl?: string;
  /** Host-provided notice content, including its own link when needed. */
  notice?: React.ReactNode;
  /** Set when a control references this notice via `aria-describedby`. */
  id?: string;
}

/**
 * The privacy notice shown wherever an account can be created.
 *
 * It is a notice, not a consent: the processing it describes is what delivering
 * the service requires, so presenting it as an opt-in would misstate the legal
 * basis. It lives in its own component because the sign-up form and the
 * passwordless form both create accounts and must say the same thing.
 */
export function LegalNotice({
  privacyPolicyUrl = '/privacy',
  notice,
  id,
}: LegalNoticeProps) {
  return (
    <p id={id} className="text-muted-foreground text-xs">
      {notice ?? (
        <>
          We process your data to provide the service, as described in our{' '}
          <a
            href={privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Privacy Policy
          </a>
          . We do not send marketing email and do not use tracking or advertising cookies.
        </>
      )}
    </p>
  );
}
