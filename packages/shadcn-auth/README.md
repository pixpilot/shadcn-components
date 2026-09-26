# next-auth-shadcn

Reusable auth screens: sign in, sign up, passwordless sign-in, password reset,
profile completion, and the signed-in account's sign-in-methods list.

Presentation only. Every component takes handlers, controlled state, and any
server-owned rule it needs from the host. The package does not depend on an auth
backend, tRPC client, server action, router, or toast. The same components cover
a password-only app and one with Google, LinkedIn, and magic links.

## Install

```bash
pnpm add @internal/next-auth-shadcn
```

Peers: `react` / `react-dom` 18 or 19. Styling comes from `@pixpilot/shadcn`, so
the host must already load that Tailwind layer.

## Usage

`AuthForms` is the whole screen, including switching between steps:

```tsx
'use client';

import { AuthForms } from '@internal/next-auth-shadcn';

export function LoginClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSentTo, setMagicLinkSentTo] = useState<string | null>(null);

  return (
    <AuthForms
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onSendMagicLink={handleSendMagicLink} // omit to hide the passwordless step
      onGoogleSignIn={handleGoogleSignIn} // omit to hide the Google button
      onLinkedInSignIn={handleLinkedInSignIn} // omit to hide the LinkedIn button
      isLoading={isLoading}
      error={error}
      magicLinkSentTo={magicLinkSentTo}
      onModeChange={() => {
        setError(null);
        setMagicLinkSentTo(null);
      }}
    />
  );
}
```

Or compose the steps yourself — `SignInForm`, `SignUpForm`, `MagicLinkForm`,
`ResetPasswordForm` and `CompleteProfileForm` are all exported and usable alone.

`CompleteProfileForm` requires the host's server-enforced display-name limit:

```tsx
import { CompleteProfileForm } from '@internal/next-auth-shadcn';

<CompleteProfileForm
  onSubmit={handleCompleteProfile}
  maxDisplayNameLength={displayNameLimit}
  isLoading={isLoading}
  error={error}
/>;
```

Pass the same limit to `CompleteProfileFields` when composing that field directly.

`SignInMethods` is the signed-in counterpart: what the account can sign in with
today, and what it could add. Use `SignInMethodsList` when the host supplies its
own section heading or card:

```tsx
import { SignInMethods } from '@internal/next-auth-shadcn';

<SignInMethods
  identities={identities} // each item needs only provider and email
  linkableProviders={['google']} // a provider already linked is filtered out
  isLoading={isLoading}
  pendingProvider={pendingProvider} // the one mid-flow, or null
  error={error}
  notice={notice}
  onConnect={handleConnect}
/>;
```

Adding GitHub or LinkedIn later is one more entry in `linkableProviders`:
labels come from `describeAuthProvider` and marks from `ProviderIcon`, both of
which fall back sensibly for a provider they have never heard of.
`identities` accepts objects with `{ provider: string, email: string | null }`;
the host may pass richer identity objects without adapting them.

## Who owns what state

`isLoading`, `error` and `magicLinkSentTo` are **controlled by the host**, and
deliberately so. The auth server actions return their failures rather than
throwing — Next.js replaces the message of any error that escapes a Server
Action with an opaque digest in production — so a resolved promise tells the
form nothing about whether the call succeeded. Only the caller knows.

That is why `MagicLinkForm` needs `sentTo` rather than flipping to its receipt
state on its own.

`onModeChange` fires on every step change, including "use a different email"
returning to the step it is already on. Use it to clear both `error` and
`magicLinkSentTo`.

### Which button spins

`isLoading` says that _something_ is happening; it cannot say which button the
user pressed. So it disables the card and spins nothing.

The spinner is owned per card instead. `useAuthPendingState` creates one pending
scope, `AuthPendingProvider` shares it, and every `AuthButton` on the card takes
its `loading` and `disabled` from it: the button whose `actionKey` is running is
the only one that spins, and everything else goes disabled until it settles.
Clicking "Sign in with Google" therefore spins the Google button alone, rather
than lighting up LinkedIn and the submit button with it.

Hosts get this for free — the cards wire it themselves. It only matters if you
compose `ProviderSignInButtons` or `AuthButton` into a card of your own, in
which case create the scope with `useAuthPendingState(isLoading)` and provide
it.

## Components

| Component               | For                                                                |
| ----------------------- | ------------------------------------------------------------------ |
| `AuthForms`             | The whole screen and the switching between steps                   |
| `SignInForm`            | Email + password, with provider buttons and the passwordless link  |
| `SignUpForm`            | Registration, including the Terms checkbox and the privacy notice  |
| `MagicLinkForm`         | Request a link; shows the receipt once `sentTo` is set             |
| `ResetPasswordForm`     | Request a password-reset email                                     |
| `CompleteProfileForm`   | Collect the display name a magic link could not supply             |
| `ProviderSignInButtons` | Google / LinkedIn buttons plus the "or continue with" rule         |
| `AuthButton`            | A button wired to its card's pending scope (see above)             |
| `AuthField`             | A labelled input with its validation message                       |
| `SignInMethods`         | The signed-in account's sign-in methods, and what it can connect   |
| `SignInMethodRow`       | One method: its mark, its account, and Connected / Connect         |
| `ProviderIcon`          | The mark for a provider key, with a generic fallback               |
| `AuthCard`              | The shared card frame: heading, optional description, error banner |
| `LegalNotice`           | The privacy notice shown wherever an account can be created        |

## Validation

The forms validate before calling your handler and render their own messages,
which is why every `<form>` here is `noValidate`. The fields keep their `type`
and `required` attributes for assistive technology and mobile keyboards, but the
native validation bubble is off: it would otherwise pre-empt the first error,
and none of the other messages on these forms (password length, consent, name
length) have a native equivalent to match.

These checks are a courtesy, not a boundary. The host must enforce its own
validation server-side and pass matching limits where the UI requests them.
