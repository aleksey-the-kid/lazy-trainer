## 1. Codebase audit

- [x] 1.1 Read `package.json`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx` and confirm stack/navigation facts
- [x] 1.2 Read `src/db/index.ts` and list all Dexie tables, current version (v12), and migration milestones
- [x] 1.3 Read `supabase/schema.sql`, `src/lib/supabase/sync.ts`, `src/lib/supabase/restore.ts` and confirm sync/restore behavior
- [x] 1.4 Read `src/lib/google-auth.ts`, `src/pages/LoginPage.tsx` and confirm auth flow
- [x] 1.5 Scan `src/pages/` and `src/lib/` to build feature-to-file map
- [x] 1.6 Read existing `docs/*.md`, `.cursor/rules/*.mdc`, `.github/workflows/deploy-pages.yml`

## 2. Project context documentation

- [x] 2.1 Create `docs/PROJECT_CONTEXT.md` with tech stack, directory layout, provider tree, and navigation model
- [x] 2.2 Add feature map (pages → lib modules → components)
- [x] 2.3 Document state management patterns (local state, contexts, no global store)
- [x] 2.4 Document i18n setup (`src/i18n/`, default language, storage)
- [x] 2.5 Document PWA behavior (`src/lib/app-update.tsx`, vite-plugin-pwa config)
- [x] 2.6 List known gaps (no tests, no URL router, client-only JWT, open RLS, dark theme only)
- [x] 2.7 Add "last verified" date and `APP_VERSION` reference

## 3. Data model documentation

- [x] 3.1 Create `docs/DATA_MODEL.md` with offline-first overview and storage hierarchy
- [x] 3.2 Document all IndexedDB tables with keys and key fields (reference `src/db/index.ts`)
- [x] 3.3 Summarize Dexie migration approach and version history highlights
- [x] 3.4 Document Supabase tables, camelCase ↔ snake_case mapping, and mirror functions
- [x] 3.5 Document sync/restore flows (login restore, manual push, read-from-local rule)
- [x] 3.6 Cross-link `docs/DATABASE_WORKOUTS.md` for import/export JSON format
- [x] 3.7 Note PostgreSQL migration convention (`db/migrations/`) vs bootstrap `supabase/schema.sql`

## 4. Developer workflow documentation

- [x] 4.1 Create `docs/DEVELOPER_WORKFLOW.md` with clone → `.env` → `npm run dev` quick start
- [x] 4.2 Document all `VITE_*` environment variables (required/optional, build-time vs runtime)
- [x] 4.3 Cross-link `docs/GOOGLE_LOGIN.md`, `docs/SUPABASE.md`, `docs/GITHUB_PAGES.md`
- [x] 4.4 Document CI/CD (`.github/workflows/deploy-pages.yml`, secrets, base path)
- [x] 4.5 Summarize Cursor rules (version/changelog policy, DB migration policy)
- [x] 4.6 Document OpenSpec workflow (config, slash commands, skills location)

## 5. OpenSpec integration

- [x] 5.1 Populate `openspec/config.yaml` `context` block with concise stack + conventions summary
- [x] 5.2 Add links from `README.md` documentation section to the three new docs

## 6. Verification

- [x] 6.1 Verify all file paths and version numbers referenced in docs match current codebase
- [x] 6.2 Confirm no application code was modified (docs and config only)
- [x] 6.3 Review docs for scannability: tables, bullet lists, cross-links — minimal prose duplication with README
