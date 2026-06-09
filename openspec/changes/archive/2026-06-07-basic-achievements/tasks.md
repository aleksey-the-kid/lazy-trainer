## 1. Data layer

- [x] 1.1 Add `UserAchievement` type and `userAchievements` table to `src/db/index.ts` (Dexie v13)
- [x] 1.2 Create `db/migrations/*_user_achievements.sql` for Supabase table + RLS
- [x] 1.3 Add mirror/restore mappers in `src/lib/supabase/sync.ts` and `restore.ts`

## 2. Achievement engine

- [x] 2.1 Create `src/lib/achievements/catalog.ts` with starter achievement definitions
- [x] 2.2 Create `src/lib/achievements/evaluate.ts` — criteria checks against IndexedDB
- [x] 2.3 Create `src/lib/achievements/index.ts` — `checkAchievements(userId)`, `getUserAchievements(userId)`
- [x] 2.4 Hook `checkAchievements` into `completeWorkout`, template create, weight entry save

## 3. i18n

- [x] 3.1 Add achievement title/description keys to `translations.ts` (ru/en)
- [x] 3.2 Add tab label and UI strings (`achievements.title`, `achievements.locked`, `achievements.unlockedAt`, etc.)

## 4. UI

- [x] 4.1 Extend `ProfileTab` with `'achievements'` and update `ProfileTabBar`
- [x] 4.2 Create `AchievementsTab` component — grid of locked/unlocked cards
- [x] 4.3 Wire achievements tab in `ProfilePage` with backfill on mount
- [x] 4.4 Create unlock toast component and show on session unlocks (not backfill)

## 5. Verification

- [x] 5.1 Manual test: new user earns `first-workout` on first complete
- [x] 5.2 Manual test: existing history backfills milestones on tab open
- [x] 5.3 Verify Supabase sync/restore includes achievements
- [x] 5.4 Verify en/ru strings and layout on mobile viewport
