import { db } from '@/db'

import type { AchievementCriterion, AchievementDefinition } from '@/lib/achievements/catalog'

interface AchievementStats {
  workoutCount: number
  templateCount: number
  weightCount: number
  distinctWorkoutDays: number
}

async function loadStats(userId: string): Promise<AchievementStats> {
  const [workoutHistory, templates, weights] = await Promise.all([
    db.workoutHistory.where('userId').equals(userId).toArray(),
    db.workoutTemplates.where('userId').equals(userId).count(),
    db.weightEntries.where('userId').equals(userId).count(),
  ])

  const days = new Set(
    workoutHistory.map((entry) => {
      const date = entry.completedAt
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }),
  )

  return {
    workoutCount: workoutHistory.length,
    templateCount: templates,
    weightCount: weights,
    distinctWorkoutDays: days.size,
  }
}

function meetsCriterion(criterion: AchievementCriterion, stats: AchievementStats): boolean {
  switch (criterion.type) {
    case 'workout-count':
      return stats.workoutCount >= criterion.min
    case 'template-count':
      return stats.templateCount >= criterion.min
    case 'weight-count':
      return stats.weightCount >= criterion.min
    case 'distinct-workout-days':
      return stats.distinctWorkoutDays >= criterion.min
  }
}

export async function evaluateAchievement(
  userId: string,
  definition: AchievementDefinition,
): Promise<boolean> {
  const stats = await loadStats(userId)
  return meetsCriterion(definition.criterion, stats)
}

export async function evaluateAllEligible(
  userId: string,
  definitions: AchievementDefinition[],
): Promise<AchievementDefinition[]> {
  const stats = await loadStats(userId)

  return definitions.filter((definition) => meetsCriterion(definition.criterion, stats))
}
