## ADDED Requirements

### Requirement: Data model document exists

The repository SHALL contain `docs/DATA_MODEL.md` documenting both local (IndexedDB) and cloud (Supabase) storage.

#### Scenario: Developer inspects storage layer

- **WHEN** a developer needs to understand where data is persisted
- **THEN** `docs/DATA_MODEL.md` explains offline-first IndexedDB as primary and Supabase as optional mirror

### Requirement: IndexedDB schema is documented

The data model document SHALL list all Dexie tables, primary keys, and current schema version (v12) with reference to `src/db/index.ts`.

#### Scenario: Table lookup

- **WHEN** an agent needs to know what fields a `UserProfile` has
- **THEN** the document lists tables (`users`, `profiles`, `weightEntries`, `bodyMeasurements`, `workoutTemplates`, `workoutSessions`, `workoutHistory`, `exerciseSetHistory`, `knownExercises`, `settings`) with key fields and types

### Requirement: Dexie migration approach is documented

The data model document SHALL explain that IndexedDB schema changes require a new Dexie version with optional `.upgrade()` in `src/db/index.ts`, and summarize major migration milestones.

#### Scenario: Agent changes local schema

- **WHEN** an agent adds a new IndexedDB field
- **THEN** the document directs them to bump Dexie version in `src/db/index.ts` (not SQL migrations)

### Requirement: Supabase schema and mapping are documented

The data model document SHALL describe PostgreSQL tables in `supabase/schema.sql`, camelCase ↔ snake_case mapping, and the fire-and-forget mirror pattern in `src/lib/supabase/sync.ts`.

#### Scenario: Agent adds Supabase column

- **WHEN** an agent changes the PostgreSQL schema
- **THEN** the document directs them to create `db/migrations/YYYYMMDDHHMMSS_description.sql` per Cursor rule (not edit `schema.sql` directly)

### Requirement: Sync and restore flows are documented

The data model document SHALL describe login restore (`restoreUserFromSupabase`), manual push (`pushLocalUserToSupabase`), and the rule that reads always come from IndexedDB.

#### Scenario: Agent debugs sync issue

- **WHEN** an agent investigates missing cloud data
- **THEN** the document explains restore-on-login replaces local data and manual sync wipes remote before upload

### Requirement: Import/export format is referenced

The data model document SHALL reference `docs/DATABASE_WORKOUTS.md` for workout JSON import/export format (version 1) and cross-link `src/lib/workout-import-export.ts`.

#### Scenario: Agent implements import

- **WHEN** an agent works on data import
- **THEN** the document points to `DATABASE_WORKOUTS.md` for field mapping and JSON examples
