import { db, type UserAchievement } from '@/db'

import {
  ACHIEVEMENT_CATALOG,
  achievementRowId,
  type AchievementId,
} from '@/lib/achievements/catalog'
import { evaluateAllEligible } from '@/lib/achievements/evaluate'
import { publishAchievementUnlocks } from '@/lib/achievements/unlock-notify'
import { mirrorUserAchievementUpsert } from '@/lib/supabase/sync'

export type { AchievementId, AchievementDefinition } from '@/lib/achievements/catalog'
export { ACHIEVEMENT_CATALOG } from '@/lib/achievements/catalog'
export { subscribeAchievementUnlocks } from '@/lib/achievements/unlock-notify'

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  return db.userAchievements.where('userId').equals(userId).toArray()
}

export async function checkAchievements(
  userId: string,
  options?: { notify?: boolean },
): Promise<AchievementId[]> {
  const existing = await getUserAchievements(userId)
  const unlockedIds = new Set(existing.map((row) => row.achievementId))

  const pending = ACHIEVEMENT_CATALOG.filter((item) => !unlockedIds.has(item.id))
  if (pending.length === 0) return []

  const eligible = await evaluateAllEligible(userId, pending)
  if (eligible.length === 0) return []

  const now = new Date()
  const rows: UserAchievement[] = eligible.map((item) => ({
    id: achievementRowId(userId, item.id),
    userId,
    achievementId: item.id,
    unlockedAt: now,
  }))

  await db.userAchievements.bulkPut(rows)
  for (const row of rows) {
    mirrorUserAchievementUpsert(row)
  }

  const newIds = eligible.map((item) => item.id)
  if (options?.notify) {
    publishAchievementUnlocks(newIds)
  }

  return newIds
}
