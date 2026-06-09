## Why

Local development currently requires a valid Google OAuth client ID and a real Google account to sign in, which blocks quick iteration on app logic (workouts, achievements, sync) when credentials are missing or OAuth is inconvenient. A dev-only test login on localhost lets developers enter the authenticated app instantly without external auth setup.

## What Changes

- Add a **Dev test login** button on the login page, visible only when `import.meta.env.DEV` is true and the app is served on localhost (or `127.0.0.1`).
- On click, create a fixed local test user in IndexedDB using the same post-login path as Google sign-in (`ensureProfile`, optional Supabase restore for the test user id).
- Keep Google Sign-In as the primary option in dev; test login is a secondary control below it.
- Strip all dev-login code from production builds via `import.meta.env.DEV` (dead-code elimination at build time).
- Document the dev test login in `docs/DEVELOPER_WORKFLOW.md`.

## Capabilities

### New Capabilities

- `dev-test-login`: Dev-only localhost test authentication bypass with fixed test user identity and shared post-login flow.

### Modified Capabilities

- `screen-experience`: Login page shows an optional dev test login control alongside Google Sign-In when conditions are met.
- `developer-workflow`: Developer docs describe when and how to use dev test login vs Google OAuth.

## Impact

- **UI:** `src/pages/LoginPage.tsx` — conditional dev button
- **Auth:** `src/lib/google-auth.ts` or new `src/lib/dev-auth.ts` — `saveDevTestUser()` helper
- **App:** `src/App.tsx` — wire dev login success handler
- **i18n:** `src/i18n/translations.ts` — button label (ru/en)
- **Docs:** `docs/DEVELOPER_WORKFLOW.md`
- **No** Dexie schema changes, no Supabase migration, no production behavior change

## Non-Goals

- Test login in production or on LAN IPs (non-localhost)
- Multiple test personas or configurable test user profiles
- Replacing Google OAuth in dev as the default path
- Backend token validation or mock Google JWT
