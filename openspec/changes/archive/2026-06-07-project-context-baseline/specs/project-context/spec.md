## ADDED Requirements

### Requirement: Project context document exists

The repository SHALL contain `docs/PROJECT_CONTEXT.md` as the primary architecture reference for developers and AI agents.

#### Scenario: Developer opens architecture reference

- **WHEN** a developer or agent needs to understand how the app is structured
- **THEN** `docs/PROJECT_CONTEXT.md` describes tech stack, directory layout, navigation model, state management, provider tree, feature modules, i18n approach, and PWA behavior

### Requirement: Tech stack is documented

The project context document SHALL list all major runtime and build dependencies with their roles.

#### Scenario: Stack lookup

- **WHEN** an agent reads the tech stack section
- **THEN** it finds React 19, TypeScript, Vite 8, Tailwind CSS 4, Dexie 4, Supabase JS, Google OAuth, and `@base-ui/react` with file references for configuration (`vite.config.ts`, `package.json`)

### Requirement: Navigation and state patterns are documented

The project context document SHALL explain that routing is state-based (not URL-based) and that data lives in IndexedDB via `src/lib/*` service modules.

#### Scenario: Agent adds a new page

- **WHEN** an agent needs to add a new screen
- **THEN** the document explains `AppPage` type in `src/App.tsx`, sidebar registration in `AppSidebar.tsx`, and the pattern of fetching from Dexie on mount

### Requirement: Feature map covers all pages

The project context document SHALL map each page (`LoginPage`, `WorkoutsPage`, `ProfilePage`, `SettingsPage`, `ConsoleLogsPage`) to its key lib modules and components.

#### Scenario: Feature area lookup

- **WHEN** an agent works on workout history
- **THEN** the document points to `src/pages/WorkoutsPage.tsx`, `src/lib/workout-sessions.ts`, and related components under `src/components/workouts/`

### Requirement: Known gaps are explicitly listed

The project context document SHALL list architectural gaps: no test runner, no URL router, client-only JWT decode, open Supabase RLS, dark theme only.

#### Scenario: Agent evaluates test strategy

- **WHEN** an agent checks testing setup
- **THEN** the document states that no test framework is configured and lint is the only CI quality gate

### Requirement: OpenSpec config contains project context summary

`openspec/config.yaml` SHALL include a populated `context` block summarizing stack, key paths, and conventions (under 60 lines).

#### Scenario: OpenSpec artifact generation

- **WHEN** a new OpenSpec change is proposed
- **THEN** the agent receives project context from `openspec/config.yaml` without re-reading the entire codebase
