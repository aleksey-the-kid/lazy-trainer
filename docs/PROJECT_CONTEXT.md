# Project Context

> **Last verified:** 2026-06-07 · **App version:** `0.0.9` (`src/version.ts`)

Architecture reference for developers and AI agents. For data storage see [DATA_MODEL.md](DATA_MODEL.md). For setup and deploy see [DEVELOPER_WORKFLOW.md](DEVELOPER_WORKFLOW.md).

---

## Tech Stack

| Layer | Technology | Config / entry |
|-------|------------|----------------|
| UI | React 19, TypeScript 6 | `src/`, `package.json` |
| Styling | Tailwind CSS 4 | `src/index.css`, `@tailwindcss/vite` |
| UI primitives | `@base-ui/react`, CVA, `cn()` | `src/components/ui/` |
| Icons | `lucide-react` | |
| Build | Vite 8 | `vite.config.ts` |
| PWA | `vite-plugin-pwa` | `registerType: 'prompt'` in `vite.config.ts` |
| Local DB | Dexie 4 (IndexedDB) | `src/db/index.ts` — DB name `LazyTrainerDB`, **v12** |
| Auth | Google OAuth | `@react-oauth/google`, `jwt-decode` |
| Cloud backup | Supabase JS v2 (optional) | `src/lib/supabase/` |
| Lint | ESLint 10 flat config | `eslint.config.js` |
| Path alias | `@/*` → `src/*` | `tsconfig.app.json` |

**Not used:** React Router, Redux/Zustand, TanStack Query, test runner.

---

## Directory Layout

```
src/
├── App.tsx              # Auth gate + page routing
├── main.tsx             # Providers, console capture init
├── db/index.ts          # All IndexedDB types + Dexie schema
├── pages/               # Top-level screens
├── components/
│   ├── layout/          # AppLayout, sidebar, header, tab bars
│   ├── ui/              # Reusable primitives (button, sheet, input…)
│   ├── workouts/        # Workout feature UI
│   ├── profile/         # Profile, charts, measurements
│   └── app/             # PWA update toast
├── lib/                 # Business logic / data access
│   └── supabase/        # client, sync (mirror), restore
├── i18n/                # translations + React context
├── hooks/               # useConsoleLogs
├── version.ts           # APP_VERSION
└── changelog.ts         # In-app changelog (ru/en)

docs/                    # Developer & setup docs
supabase/schema.sql      # PostgreSQL bootstrap DDL
openspec/                # OpenSpec config + changes
.cursor/rules/           # Cursor agent rules
.github/workflows/       # CI/CD
```

---

## Provider Tree

```
StrictMode
  └── I18nProvider          (src/i18n/context.tsx)
        └── GoogleOAuthProvider
              └── App
                    └── AppUpdateProvider   (when logged in)
                          └── AppLayout → pages
```

---

## Navigation

**No URL router.** Page selection is React state in `src/App.tsx`:

```typescript
type AppPage = 'profile' | 'workouts' | 'settings' | 'console'
```

- Primary nav: floating pill bottom bar — `src/components/layout/AppBottomNav.tsx`
- Header: avatar + greeting — `src/components/layout/PageHeader.tsx`
- Sign-out + dev console: `SettingsPage`
- Default page after login: `workouts`
- Workouts page has internal pill tabs/overlays (`templates` | `exercises` | `history` + detail/active overlays) in `src/pages/WorkoutsPage.tsx`

---

## State Management

| Pattern | Where | Purpose |
|---------|-------|---------|
| `useState` / `useEffect` | Pages, components | Local UI and fetched data |
| `I18nProvider` | `src/i18n/context.tsx` | Language + `t()` translator |
| `AppUpdateProvider` | `src/lib/app-update.tsx` | PWA service worker updates |
| `PageHeaderContext` | `src/components/layout/PageHeaderContext.tsx` | Dynamic header actions |
| Dexie via `lib/*` | Service modules | Persistent data — no global store |

**Data flow:** pages call `lib/*` async functions → read/write IndexedDB → fire-and-forget `mirror*()` to Supabase when configured.

---

## Feature Map

| Page | Lib modules | Key components |
|------|-------------|----------------|
| `LoginPage` | `google-auth.ts` | `GoogleLoginButton` |
| `WorkoutsPage` | `workout-templates.ts`, `workout-sessions.ts`, `workout-import-export.ts`, `exercise-presets.ts`, `exercise-chart-data.ts` | `WorkoutTemplatesList`, `WorkoutBuilderSheet`, `ActiveWorkoutView`, `WorkoutHistoryTab`, `ExerciseHistoryTab`, `ExerciseCharts` |
| `ProfilePage` | `profile.ts`, `weight-history.ts`, `body-measurements.ts`, `calories.ts` | `WeightChart`, `BodyFigure`, `ProfileMeasurementsTab`, `CalorieBreakdownSheet` |
| `SettingsPage` | `settings.ts`, `workout-import-export.ts`, `supabase/sync.ts` | PWA update controls, import/export, manual Supabase sync |
| `ConsoleLogsPage` | `console-capture.ts` | Mobile debugging console |

---

## Auth Flow

1. App loads → `getCurrentUser()` reads most recent user from `db.users` (by `loggedInAt`)
2. No user → `LoginPage` with Google Sign-In
3. On success → JWT decoded client-side (`jwt-decode`) for `sub`, `email`, `name`, `picture`
4. If Supabase configured → `restoreUserFromSupabase(user.id)` (cloud → local)
5. User saved to IndexedDB → `mirrorUserUpsert()` → `ensureProfile()` creates default profile
6. Logout → `clearCurrentUser()` deletes from IndexedDB + mirrors delete

**Note:** No backend token validation. Supabase is storage only — keyed by Google `sub`, not Supabase Auth.

---

## i18n

| Item | Value |
|------|-------|
| Languages | `en`, `ru` |
| Default | `ru` (until settings load from IndexedDB) |
| Storage | `db.settings` row `{ id: 'app', language }` |
| Files | `src/i18n/translations.ts`, `src/i18n/context.tsx` |
| API | `useI18n()` → `{ language, setLanguage, t, ready }` |
| Changelog | Bilingual in `src/changelog.ts` |

---

## Visual Design

- **Theme:** warm light palette — orange primary, beige background, magenta chart accent (`src/index.css`)
- **Patterns:** glassmorphism panels, 20–32px radii, photo-backed hero cards, soft shadows
- **Imagery:** `public/images/ui/` with attribution in `ATTRIBUTION.md`; helpers in `src/lib/ui-images.ts`
- **Login:** full-bleed hero photo + frosted glass sign-in panel

---

## PWA

- Config: `vite.config.ts` — `registerType: 'prompt'`, warm `theme_color` / `background_color`
- Update logic: `src/lib/app-update.tsx` — checks on visibility change and settings page visit
- UI: `src/components/app/UpdateToast.tsx`

---

## Known Gaps

| Gap | Detail |
|-----|--------|
| No test runner | Only `npm run lint`; no Vitest/Jest/Playwright |
| No URL router | Deep linking / browser back not supported |
| Client-only JWT | Google token decoded in browser, not verified server-side |
| Open Supabase RLS | `anon_all_*` policies — personal backup only |
| Light theme only | No dark mode toggle |
| Single-user session | `getCurrentUser()` returns most recent login, not multi-account |

---

## Related Docs

- [DATA_MODEL.md](DATA_MODEL.md) — IndexedDB + Supabase storage
- [DEVELOPER_WORKFLOW.md](DEVELOPER_WORKFLOW.md) — setup, env, deploy, OpenSpec
- [DATABASE_WORKOUTS.md](DATABASE_WORKOUTS.md) — workout import/export JSON format
