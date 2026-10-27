---
'@pixpilot/shadcn-auth': minor
---

Add the sign-in callback page as a hook and a screen: `useAuthCallback` reads the code from the redirect URL, hands it to your `exchangeCode` once (Strict Mode safe) and returns its status, which `AuthCallbackScreen` renders; `readCallbackParams` is exported too. Add `SignedOutScreen`, the page signing out lands on, with links back to sign-in, home and contact.
