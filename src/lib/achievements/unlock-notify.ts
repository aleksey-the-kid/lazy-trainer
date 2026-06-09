import type { AchievementId } from '@/lib/achievements/catalog'

type UnlockListener = (achievementIds: AchievementId[]) => void

const listeners = new Set<UnlockListener>()

export function subscribeAchievementUnlocks(listener: UnlockListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function publishAchievementUnlocks(achievementIds: AchievementId[]): void {
  if (achievementIds.length === 0) return
  for (const listener of listeners) {
    listener(achievementIds)
  }
}
