import type { WorkoutType } from '@/db'

const base = import.meta.env.BASE_URL

export const UI_IMAGES = {
  loginHero: `${base}images/ui/login-hero.jpg`,
  strength: `${base}images/ui/strength.jpg`,
  cardio: `${base}images/ui/cardio.jpg`,
  gym: `${base}images/ui/gym.jpg`,
} as const

export function workoutTypeImage(type: WorkoutType): string {
  return type === 'cardio' ? UI_IMAGES.cardio : UI_IMAGES.strength
}

export function workoutTemplateImage(templateId: string, type: WorkoutType): string {
  const pool = type === 'cardio' ? [UI_IMAGES.cardio, UI_IMAGES.gym] : [UI_IMAGES.strength, UI_IMAGES.gym]
  let hash = 0
  for (let i = 0; i < templateId.length; i++) {
    hash = (hash + templateId.charCodeAt(i)) % pool.length
  }
  return pool[hash] ?? pool[0]
}
