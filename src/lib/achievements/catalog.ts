import {
  CalendarDays,
  Dumbbell,
  LayoutList,
  Scale,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

import type { TranslationKey } from '@/i18n/translations'

export type AchievementId =
  | 'first-workout'
  | 'workouts-5'
  | 'workouts-10'
  | 'first-template'
  | 'first-weight'
  | 'streak-3'

export type AchievementCriterion =
  | { type: 'workout-count'; min: number }
  | { type: 'template-count'; min: number }
  | { type: 'weight-count'; min: number }
  | { type: 'distinct-workout-days'; min: number }

export interface AchievementDefinition {
  id: AchievementId
  icon: LucideIcon
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  criterion: AchievementCriterion
}

export const ACHIEVEMENT_CATALOG: AchievementDefinition[] = [
  {
    id: 'first-workout',
    icon: Trophy,
    titleKey: 'achievements.firstWorkout.title',
    descriptionKey: 'achievements.firstWorkout.description',
    criterion: { type: 'workout-count', min: 1 },
  },
  {
    id: 'workouts-5',
    icon: Dumbbell,
    titleKey: 'achievements.workouts5.title',
    descriptionKey: 'achievements.workouts5.description',
    criterion: { type: 'workout-count', min: 5 },
  },
  {
    id: 'workouts-10',
    icon: Dumbbell,
    titleKey: 'achievements.workouts10.title',
    descriptionKey: 'achievements.workouts10.description',
    criterion: { type: 'workout-count', min: 10 },
  },
  {
    id: 'first-template',
    icon: LayoutList,
    titleKey: 'achievements.firstTemplate.title',
    descriptionKey: 'achievements.firstTemplate.description',
    criterion: { type: 'template-count', min: 1 },
  },
  {
    id: 'first-weight',
    icon: Scale,
    titleKey: 'achievements.firstWeight.title',
    descriptionKey: 'achievements.firstWeight.description',
    criterion: { type: 'weight-count', min: 1 },
  },
  {
    id: 'streak-3',
    icon: CalendarDays,
    titleKey: 'achievements.streak3.title',
    descriptionKey: 'achievements.streak3.description',
    criterion: { type: 'distinct-workout-days', min: 3 },
  },
]

export function achievementRowId(userId: string, achievementId: AchievementId): string {
  return `${userId}::${achievementId}`
}
