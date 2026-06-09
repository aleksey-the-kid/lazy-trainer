# Developer Workflow

> **Last verified:** 2026-06-07 · **App version:** `0.0.9`

Setup, environment, deployment, and agent conventions for Lazy Trainer.

---

## Quick Start

```bash
git clone <repo-url>
cd lazy-trainer
npm install
cp .env.example .env    # fill in keys (see below)
npm run dev
```

Open the dev server URL. `vite.config.ts` sets `host: true` for LAN/mobile testing.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (only quality gate — no tests in CI) |

---

## Environment Variables

Template: `.env.example` · Types: `src/vite-env.d.ts`

All client env vars must be prefixed `VITE_` (embedded at build time).

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_GOOGLE_CLIENT_ID` | **Yes** (for production login) | Google OAuth client ID |
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key |
| `VITE_BASE_PATH` | Build-time only | Asset base path (default `/`; CI uses `/lazy-trainer/`) |

If Supabase vars are empty, cloud sync is skipped — app works fully offline.

### Dev test login (localhost only)

When running `npm run dev` on `localhost` or `127.0.0.1`, the login page shows a **Dev test login** button below Google Sign-In. It signs you in as a fixed local user without Google OAuth:

| Field | Value |
|-------|-------|
| User id | `dev-test-user` |
| Email | `dev@localhost` |
| Name | `Dev User` |

Use this to exercise authenticated app logic (workouts, achievements, profile) when `VITE_GOOGLE_CLIENT_ID` is missing or OAuth setup is inconvenient. The button is stripped from production builds (`npm run build`) and is not shown on LAN IPs (e.g. `192.168.x.x`) — use Google OAuth for those cases.

Implementation: `src/lib/dev-auth.ts`, gated by `import.meta.env.DEV` and hostname check.

### Setup Guides

| Topic | Doc |
|-------|-----|
| Google OAuth | [GOOGLE_LOGIN.md](GOOGLE_LOGIN.md) |
| Supabase backup | [SUPABASE.md](SUPABASE.md) |
| GitHub Pages deploy | [GITHUB_PAGES.md](GITHUB_PAGES.md) |

---

## CI/CD

**Workflow:** `.github/workflows/deploy-pages.yml`

| Item | Value |
|------|-------|
| Trigger | Push to `master`, or manual `workflow_dispatch` |
| Node | 20 |
| Build | `npm ci` → `npm run build` |
| Deploy | GitHub Pages via `actions/deploy-pages@v4` |
| Production URL | https://aleksey-the-kid.github.io/lazy-trainer/ |

**GitHub Secrets** (injected at build):

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Note:** Lint is not run in CI — only build + deploy.

### Local GitHub Pages preview

```powershell
$env:VITE_BASE_PATH="/lazy-trainer/"
npm run build
npm run preview
```

---

## Cursor Rules

Rules live in `.cursor/rules/`:

| Rule | Scope | Summary |
|------|-------|---------|
| `app-version.mdc` | Always apply | Do **not** bump version/changelog unless user explicitly asks. Version in `src/version.ts`, sync `package.json`. |
| `db-migrations.mdc` | `supabase/**`, `db/**`, `src/db/**` | PostgreSQL changes → `db/migrations/*.sql`, not direct edits to `schema.sql`. IndexedDB → Dexie version bump in `src/db/index.ts`. |

---

## OpenSpec Workflow

Config: `openspec/config.yaml` (schema: `spec-driven`)

### Slash Commands

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Create change + generate proposal, design, specs, tasks |
| `/opsx:apply` | Implement tasks from a change |
| `/opsx:explore` | Explore ideas without committing to a change |
| `/opsx:archive` | Archive completed change |

Skills: `.cursor/skills/openspec-{propose,apply,explore,archive}-change/SKILL.md`  
Commands: `.cursor/commands/opsx-{propose,apply,explore,archive}.md`

### Artifact Flow

```
proposal.md → design.md + specs/**/*.md → tasks.md → implementation
```

Active changes live in `openspec/changes/<name>/`.

---

## Code Conventions

| Convention | Detail |
|------------|--------|
| Imports | `@/` alias for `src/` |
| Domain logic | `src/lib/*` — pages orchestrate, lib persists |
| Types | Co-located with DB in `src/db/index.ts` |
| IDs | `crypto.randomUUID()` via `createId()` in `workout-utils.ts` |
| User ID | Google JWT `sub` |
| Dates | `YYYY-MM-DD` strings for calendar dates; `Date` for timestamps |
| Errors | String codes (`'ACTIVE_SESSION_EXISTS'`, `'INVALID_JSON'`) — caught in UI for i18n |
| UI pattern | CVA variants + `@base-ui/react` + `cn()` in `src/lib/utils.ts` |

---

## Documentation Index

| Doc | Content |
|-----|---------|
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Architecture, navigation, features, i18n, PWA |
| [DATA_MODEL.md](DATA_MODEL.md) | IndexedDB + Supabase schema, sync/restore |
| [DATABASE_WORKOUTS.md](DATABASE_WORKOUTS.md) | Workout import/export JSON format |
| [GOOGLE_LOGIN.md](GOOGLE_LOGIN.md) | Google Cloud Console setup |
| [SUPABASE.md](SUPABASE.md) | Supabase backup setup |
| [GITHUB_PAGES.md](GITHUB_PAGES.md) | Deploy and custom domain |
