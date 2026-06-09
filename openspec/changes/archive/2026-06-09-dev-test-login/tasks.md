## 1. Dev auth module

- [x] 1.1 Create `src/lib/dev-auth.ts` with `DEV_TEST_USER_ID`, `isDevTestLoginAvailable()`, and `saveDevTestUser()` mirroring `saveGoogleUser` post-login flow
- [x] 1.2 Export helpers from a sensible entry point if the project uses barrel files for lib auth

## 2. Login UI

- [x] 2.1 Add `login.devTestLogin` i18n keys to `src/i18n/translations.ts` (ru/en)
- [x] 2.2 Update `LoginPage` to accept `onDevTestLogin` callback and render muted secondary button when `isDevTestLoginAvailable()` is true
- [x] 2.3 Show dev test login even when `missingClientId` is true (per spec)

## 3. App wiring

- [x] 3.1 Add `handleDevTestLogin` in `src/App.tsx` calling `saveDevTestUser()` and `setUser`
- [x] 3.2 Pass handler to `LoginPage` as `onDevTestLogin`

## 4. Documentation

- [x] 4.1 Document dev test login in `docs/DEVELOPER_WORKFLOW.md` (availability, test user identity, vs Google OAuth)

## 5. Verification

- [x] 5.1 Manual test: `npm run dev` on `localhost` — dev test login button visible, enters app without Google
- [x] 5.2 Manual test: dev test login works without `VITE_GOOGLE_CLIENT_ID`
- [x] 5.3 Manual test: `npm run build` + `npm run preview` — no dev test login button
- [x] 5.4 Manual test: dev mode on LAN IP — dev test login not shown
