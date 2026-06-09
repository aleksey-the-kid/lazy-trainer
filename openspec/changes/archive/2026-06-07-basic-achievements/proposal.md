## Why

Lazy Trainer tracks workouts, weight, and progress well, but offers no positive feedback loops beyond raw history. Basic achievements give users lightweight milestones (first workout, streaks, volume milestones) that increase retention and make the app feel more complete — without adding social features or gamification complexity.

## What Changes

- Add a static achievement catalog (~6–8 milestones) with bilingual titles/descriptions.
- Store unlocked achievements per user in IndexedDB (`userAchievements` table, Dexie v13).
- Evaluate and unlock achievements on key events: workout completed, template created, weight logged; backfill from existing history on first check.
- Mirror unlocks to Supabase when configured (`db/migrations/` + sync helpers).
- Show achievements on Profile (new tab or section): locked/unlocked states, unlock date.
- Optional unlock toast when a new achievement is earned during a session.
- i18n keys for all achievement copy (ru/en).

## Capabilities

### New Capabilities

- `achievement-catalog`: Static achievement definitions, criteria types, and bilingual metadata.
- `achievement-tracking`: Persistence, evaluation engine, event hooks, retroactive backfill, Supabase sync.
- `achievements-ui`: Profile achievements view, locked/unlocked presentation, unlock notification.

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- **Data:** `src/db/index.ts` (v13), new `src/lib/achievements/*`
- **Hooks:** `completeWorkout`, template save, weight entry
- **UI:** `ProfilePage`, new achievements components
- **Supabase:** new migration SQL, `sync.ts` / `restore.ts` mappers
- **i18n:** `translations.ts` achievement keys
- **Export/import:** achievements excluded from workout JSON export v1 (non-goal for basic); restore from Supabase on login

## Non-Goals (this change)

- Leaderboards, social sharing, custom user-defined achievements
- Achievement icons as custom illustrations (use Lucide icons)
- Push notifications for unlocks
- Including achievements in workout JSON import/export v1
