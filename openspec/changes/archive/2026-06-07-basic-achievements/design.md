## Context

The app records workout completion in `completeWorkout()` (`src/lib/workout-sessions.ts`), templates in `workout-templates.ts`, and weight in `weight-history.ts`. Profile uses tabbed layout (`ProfilePage` + `ProfileTabBar`). Data is offline-first with optional Supabase mirror.

No achievement system exists today. UI follows warm light theme with orange accents, glass cards, and pill tabs.

## Goals / Non-Goals

**Goals:**

- Ship ~6–8 meaningful starter achievements tied to existing data
- Unlock automatically — no manual "claim" step
- Backfill unlocks for users who already have qualifying history
- Fit achievements into Profile without new top-level navigation
- Sync unlocks to Supabase for backup/restore

**Non-Goals:**

- Complex progress bars for multi-step achievements (binary unlocked/locked only for v1)
- Achievement points/levels system
- Editing achievements via admin UI

## Decisions

### 1. Static catalog in code

Achievements defined in `src/lib/achievements/catalog.ts` as a typed array. Criteria evaluated by a small engine — not stored in DB.

**Alternative:** DB-driven catalog. Rejected for basic scope — code catalog is simpler and versioned with app.

### 2. Starter achievements (v1)

| ID | Criteria |
|----|----------|
| `first-workout` | ≥1 entry in `workoutHistory` |
| `workouts-5` | ≥5 completed workouts |
| `workouts-10` | ≥10 completed workouts |
| `first-template` | ≥1 `workoutTemplate` |
| `first-weight` | ≥1 `weightEntry` |
| `streak-3` | 3+ distinct calendar days with completed workouts within any rolling 7-day window OR 3 consecutive days with workouts |

For `streak-3`, use **3 workouts on distinct dates** (simpler than rolling window): count unique dates in history ≥ 3.

**Alternative:** Consecutive-day streak. Deferred — can add `streak-week` later.

### 3. Storage model

```typescript
interface UserAchievement {
  id: string           // same as achievementId (one row per unlock)
  userId: string
  achievementId: string
  unlockedAt: Date
}
```

Table: `userAchievements` — PK `id` (= `achievementId`), index `userId`.

Dexie v13 adds table. Supabase table `user_achievements` via `db/migrations/YYYYMMDDHHMMSS_user_achievements.sql`.

### 4. Evaluation flow

```
Event (workout complete / template save / weight log)
  → checkAchievements(userId)
  → for each catalog item not yet unlocked: evaluate criteria
  → bulk put new unlocks + mirrorUpsert
  → return newly unlocked IDs (for toast)
```

Also run `checkAchievements(userId)` when Profile achievements tab opens (backfill + catch missed events).

### 5. UI placement

Add **Achievements** as 4th tab on Profile (`ProfileTab` → `'achievements'`).

Grid of cards: icon, title, description. Locked = muted + lock icon; unlocked = accent border + unlock date.

Toast: reuse pattern from `UpdateToast` or inline toast in `AppLayout` context — show once per session per unlock batch.

### 6. i18n

Achievement title/description keys: `achievements.<id>.title`, `achievements.<id>.description` in `translations.ts`. Catalog references key IDs, not inline strings.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Backfill scans slow on large history | Criteria use counts/queries, not full replay; debounce check on tab open |
| Supabase schema drift | Migration file + restore mapper |
| Tab bar overcrowding (4 tabs) | Pills scroll horizontally (already supported) |
| Toast spam on backfill | Only toast for unlocks during current session events, not backfill |

## Migration Plan

1. Dexie v13 + Supabase migration SQL
2. Deploy lib + hooks (no UI) — unlocks start persisting
3. Profile achievements tab + toast
4. Login restore includes `user_achievements`

Rollback: achievements table ignored if old app version; no breaking changes to existing tables.

## Open Questions

- Show achievement count badge on Profile tab icon? (Nice-to-have — include if cheap)
- Retroactive toast on first open? (Recommend no — silent backfill only)
