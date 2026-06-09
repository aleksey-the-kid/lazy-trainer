# developer-workflow Specification

## Purpose
TBD - created by archiving change project-context-baseline. Update Purpose after archive.
## Requirements
### Requirement: Developer workflow document exists

The repository SHALL contain `docs/DEVELOPER_WORKFLOW.md` covering local setup, environment variables, auth configuration, deployment, and agent conventions.

#### Scenario: New contributor onboarding

- **WHEN** a developer clones the repo for the first time
- **THEN** `docs/DEVELOPER_WORKFLOW.md` provides step-by-step setup from `.env.example` through `npm run dev`

### Requirement: Environment variables are documented

The developer workflow document SHALL list all `VITE_*` variables with required/optional status, purpose, and references to `src/vite-env.d.ts` and `.env.example`.

#### Scenario: Missing env var

- **WHEN** Google login fails due to missing client ID
- **THEN** the document explains `VITE_GOOGLE_CLIENT_ID` is required and links to `docs/GOOGLE_LOGIN.md`

### Requirement: External service setup is cross-linked

The developer workflow document SHALL cross-link existing guides: `docs/GOOGLE_LOGIN.md`, `docs/SUPABASE.md`, `docs/GITHUB_PAGES.md`.

#### Scenario: Deploy to production

- **WHEN** a developer deploys to GitHub Pages
- **THEN** the document references `docs/GITHUB_PAGES.md` and notes CI secrets (`VITE_GOOGLE_CLIENT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BASE_PATH=/lazy-trainer/`)

### Requirement: Cursor rules are documented

The developer workflow document SHALL summarize `.cursor/rules/` conventions: version/changelog bump policy and DB migration policy.

#### Scenario: Agent changes database

- **WHEN** an AI agent modifies PostgreSQL schema
- **THEN** the document references `db-migrations.mdc` rule requiring SQL files in `db/migrations/`

### Requirement: OpenSpec workflow is documented

The developer workflow document SHALL describe OpenSpec setup (`openspec/config.yaml`), available slash commands (`/opsx:propose`, `/opsx:apply`, `/opsx:explore`, `/opsx:archive`), and skill locations under `.cursor/skills/`.

#### Scenario: Agent starts spec-driven change

- **WHEN** a developer runs `/opsx:propose`
- **THEN** the document explains the artifact flow (proposal → design → specs → tasks → apply)

### Requirement: CI pipeline is documented

The developer workflow document SHALL describe `.github/workflows/deploy-pages.yml`: trigger on `master` push, Node 20, build + GitHub Pages deploy, and note that lint is not run in CI.

#### Scenario: CI failure investigation

- **WHEN** a GitHub Actions build fails
- **THEN** the document identifies the single deploy workflow and its build steps (`npm ci`, `npm run build`)

### Requirement: Dev test login is documented

`docs/DEVELOPER_WORKFLOW.md` SHALL document the dev test login: when it appears (dev mode + localhost), what test user identity is used, and that Google OAuth remains the path for production and LAN testing.

#### Scenario: Developer without Google credentials

- **WHEN** a developer runs `npm run dev` on localhost without `VITE_GOOGLE_CLIENT_ID`
- **THEN** the document explains they can use dev test login to exercise authenticated app logic locally

