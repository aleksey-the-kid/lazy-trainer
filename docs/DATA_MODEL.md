# Data Model

> **Last verified:** 2026-06-07 · **Dexie version:** 12 · **App version:** `0.0.9`

Storage architecture for Lazy Trainer. Source of truth for schema: `src/db/index.ts` (IndexedDB) and `supabase/schema.sql` (PostgreSQL bootstrap).

---

## Storage Hierarchy

```
┌─────────────────────────────────────────┐
│  UI (pages / components)                │
└─────────────────┬───────────────────────┘
                  │ read always from here
                  ▼
┌─────────────────────────────────────────┐
│  IndexedDB (Dexie) — primary, offline   │
│  src/lib/* service modules              │
└─────────────────┬───────────────────────┘
                  │ write mirror (fire-and-forget)
                  ▼
┌─────────────────────────────────────────┐
│  Supabase PostgreSQL — optional backup  │
│  src/lib/supabase/sync.ts               │
└─────────────────────────────────────────┘
```

**Rules:**
- Reads always come from IndexedDB
- Local writes happen first; Supabase mirror is async and non-blocking
- If Supabase env vars are empty, app works fully offline

---

## IndexedDB (Dexie)

**File:** `src/db/index.ts`  
**Database name:** `LazyTrainerDB`  
**Current version:** 12

### Tables

| Table | Primary key | Key fields |
|-------|-------------|------------|
| `users` | `id` | `email`, `name`, `picture`, `loggedInAt` |
| `profiles` | `userId` | `firstName`, `lastName`, `sex`, `dateOfBirth`, `heightCm`, `weightKg`, `activityLevel` |
| `weightEntries` | `id` | `userId`, `date`, `weightKg` |
| `bodyMeasurements` | `id` | `userId`, `date`, 9 measurement fields (`neckCm`…`abdomenCm`) |
| `workoutTemplates` | `id` | `userId`, `name`, `type`, `cardioDurationMinutes`, `cardioEquipment`, `exercises[]`, `createdAt`, `updatedAt` |
| `workoutSessions` | `id` | `userId`, `templateId`, `status` (`active`\|`completed`), `exercises[]`, cardio fields, `startedAt`, `completedAt` |
| `workoutHistory` | `id` | `userId`, `sessionId`, `workoutType`, `totalVolumeKg`, `note`, `completedAt` |
| `exerciseSetHistory` | `id` | `userId`, `exerciseName`, `date`, `weightKg`, `reps`, `sessionId`, `toFailure` |
| `knownExercises` | `id` | `userId`, `name`, `doubleStats` |
| `settings` | `id` (`'app'`) | `language` (`en`\|`ru`) |

### Dexie Migrations

Bump `db.version(N)` in `src/db/index.ts` for schema changes. Use `.upgrade()` for data transforms.

| Version | Change |
|---------|--------|
| v1 | `users` |
| v2 | `profiles`, `settings` |
| v3 | `weightEntries` |
| v4 | Workout tables + `knownExercises`, `exerciseSetHistory` |
| v5 | Cardio fields on templates/sessions/history |
| v6 | `sex` on profiles |
| v7 | (stores only) |
| v8 | Normalize exercise names, merge duplicate `knownExercises` |
| v9 | `bodyMeasurements` table |
| v10 | Rename `calfCm` → `abdomenCm` in body measurements |
| v11 | `loggedInAt` index on users |
| v12 | `note` on workout history |

---

## Supabase (PostgreSQL)

**Bootstrap DDL:** `supabase/schema.sql` — run once in Supabase SQL Editor for new projects.

**Schema changes:** do **not** edit `schema.sql` directly. Add migration files to `db/migrations/YYYYMMDDHHMMSS_description.sql` (see `.cursor/rules/db-migrations.mdc`).

### Table Mapping

| IndexedDB table | PostgreSQL table | Notes |
|-----------------|------------------|-------|
| `users` | `users` | |
| `profiles` | `profiles` | PK is `user_id` |
| `weightEntries` | `weight_entries` | |
| `bodyMeasurements` | `body_measurements` | |
| `workoutTemplates` | `workout_templates` | `exercises` stored as JSONB |
| `workoutSessions` | `workout_sessions` | `exercises` stored as JSONB |
| `workoutHistory` | `workout_history` | |
| `exerciseSetHistory` | `exercise_set_history` | |
| `knownExercises` | `known_exercises` | |
| `settings` | `app_settings` | |

### Naming Convention

TypeScript uses **camelCase**; PostgreSQL uses **snake_case**. Mappers live in:
- `src/lib/supabase/sync.ts` — local → remote (`mapUser`, `mapProfile`, …)
- `src/lib/supabase/restore.ts` — remote → local (`fromProfile`, `fromWeightEntry`, …)

### Mirror Functions

All exported from `src/lib/supabase/sync.ts`:

| Function | Trigger |
|----------|---------|
| `mirrorUserUpsert` / `mirrorUserDelete` | Login / logout |
| `mirrorProfileUpsert` | Profile save |
| `mirrorWeightEntryUpsert` | Weight log |
| `mirrorBodyMeasurementUpsert` | Body measurement save |
| `mirrorWorkoutTemplateUpsert` / `Delete` | Template CRUD |
| `mirrorWorkoutSessionUpsert` / `Delete` | Session CRUD |
| `mirrorWorkoutHistoryUpsert` / `Delete` | History CRUD |
| `mirrorExerciseSetHistoryUpsert` / `Delete` | Set history CRUD |
| `mirrorKnownExerciseUpsert` | Exercise dictionary |
| `mirrorAppSettingsUpsert` | Language change |
| `mirrorImportWorkoutData` | Bulk import |
| `pushLocalUserToSupabase` | Manual full sync (Settings) |

Mirror calls are fire-and-forget — errors logged to console, UI never blocked.

---

## Sync & Restore Flows

### Login restore

`restoreUserFromSupabase(userId)` in `src/lib/supabase/restore.ts`:
1. Fetches all user rows from Supabase tables
2. Clears and repopulates local IndexedDB for that user
3. Called in `saveGoogleUser()` before saving the new session

### Manual push

`pushLocalUserToSupabase(userId)` in `src/lib/supabase/sync.ts`:
1. Wipes all remote data for the user
2. Uploads fresh copy from IndexedDB
3. Triggered from Settings → "Sync to database"

### Read path

All UI reads go through `lib/*` → IndexedDB. Supabase is never queried during normal app use.

---

## Import / Export

Workout data import/export uses JSON format **v1**.

- Implementation: `src/lib/workout-import-export.ts`
- Detailed spec with field mapping and examples: [DATABASE_WORKOUTS.md](DATABASE_WORKOUTS.md)

---

## Related Docs

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) — app architecture
- [SUPABASE.md](SUPABASE.md) — Supabase setup and restore behavior
- [DATABASE_WORKOUTS.md](DATABASE_WORKOUTS.md) — workout JSON format
