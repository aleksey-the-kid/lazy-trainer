import type { WeightEntry } from '@/db'
import { db } from '@/db'
import { checkAchievements } from '@/lib/achievements'
import { mirrorWeightEntryUpsert } from '@/lib/supabase/sync'

function todayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function entryId(userId: string, date: string): string {
  return `${userId}_${date}`
}

export async function recordWeight(
  userId: string,
  weightKg: number,
  date = todayDateString(),
): Promise<WeightEntry> {
  const entry: WeightEntry = {
    id: entryId(userId, date),
    userId,
    date,
    weightKg,
  }

  await db.weightEntries.put(entry)
  mirrorWeightEntryUpsert(entry)
  void checkAchievements(userId, { notify: true })
  return entry
}

export async function getWeightHistory(userId: string): Promise<WeightEntry[]> {
  return db.weightEntries.where('userId').equals(userId).sortBy('date')
}

export async function clearWeightHistory(): Promise<void> {
  await db.weightEntries.clear()
}

export async function syncWeightHistoryFromProfile(
  userId: string,
  weightKg: number | null,
): Promise<WeightEntry[]> {
  if (weightKg == null) {
    return getWeightHistory(userId)
  }

  const history = await getWeightHistory(userId)
  if (history.length === 0) {
    await recordWeight(userId, weightKg)
    return getWeightHistory(userId)
  }

  return history
}
