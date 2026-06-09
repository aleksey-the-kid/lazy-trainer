## Context

Auth today flows through `LoginPage` → `GoogleLoginButton` → `saveGoogleUser(credential)` in `src/lib/google-auth.ts`, which decodes a Google JWT, writes a `User` to IndexedDB, optionally restores from Supabase, and calls `ensureProfile`. `App.tsx` gates the app on `getCurrentUser()`.

Developers without `VITE_GOOGLE_CLIENT_ID` see only an error message. Even with credentials, Google OAuth adds friction when testing features like achievements, workouts, or sync.

Vite exposes `import.meta.env.DEV` (true only in `npm run dev`) and tree-shakes dead branches in production builds.

## Goals / Non-Goals

**Goals:**

- One-click sign-in on localhost during dev without Google OAuth
- Reuse the same post-login pipeline (IndexedDB user, profile, optional Supabase restore)
- Zero production surface area (no button, no code path in `npm run build`)
- Restrict to localhost hostnames only (`localhost`, `127.0.0.1`)

**Non-Goals:**

- LAN testing (`192.168.x.x`) — use Google OAuth or set up credentials
- Configurable test users or env-driven test identity
- Mock JWT generation or changes to Supabase RLS
- E2E test framework integration

## Decisions

### 1. Gate with `import.meta.env.DEV` + hostname check

**Choice:** Show dev login when `import.meta.env.DEV && isLocalhost()`.

**Rationale:** `DEV` is stripped in production builds. Hostname check adds defense-in-depth if someone runs a dev build against a non-local origin.

**Alternative considered:** `VITE_DEV_TEST_LOGIN=true` env flag — rejected; extra config and risk of leaking to CI/production secrets.

### 2. Fixed test user identity

**Choice:** Constant id `dev-test-user`, email `dev@localhost`, name `Dev User`, empty picture.

```ts
export const DEV_TEST_USER_ID = 'dev-test-user'
```

**Rationale:** Predictable id for Supabase restore debugging; no JWT needed.

**Alternative considered:** Random uuid per session — rejected; loses persisted state across refreshes during dev.

### 3. Shared save helper in `src/lib/dev-auth.ts`

**Choice:** `saveDevTestUser(): Promise<User>` mirrors `saveGoogleUser` without JWT decode — same restore/put/mirror/ensureProfile sequence.

**Rationale:** Keeps `google-auth.ts` focused on Google; dev auth is clearly isolated and easy to grep.

**Alternative considered:** Inline in `LoginPage` — rejected; violates lib/ convention.

### 4. UI placement on LoginPage

**Choice:** Secondary text button below Google Sign-In, muted style, labeled via i18n (`login.devTestLogin`).

**Rationale:** Google remains primary; dev control is discoverable but not prominent.

### 5. App.tsx handler

**Choice:** `handleDevTestLogin` calls `saveDevTestUser()` then `setUser` — parallel to `handleGoogleSuccess`.

No change to auth gate logic beyond wiring the new callback prop on `LoginPage`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Dev build served on public tunnel (ngrok) | Hostname check limits to localhost/127.0.0.1 only |
| Test user collides with real data in IndexedDB | Fixed id is dev-only; sign-out clears user; document "clear site data" if needed |
| Supabase restore for test user id hits empty remote | Same as new Google user — acceptable for dev |
| Developer forgets test login is dev-only | Document in DEVELOPER_WORKFLOW.md |

## Migration Plan

No migration. Ship as a dev-only UI addition. Production builds exclude the code path automatically.

## Open Questions

None — scope is intentionally minimal.
