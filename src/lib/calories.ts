import type { ActivityLevel, Sex, UserProfile } from '@/db'

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

export interface CalorieBreakdown {
  age: number
  weightKg: number
  heightCm: number
  sex: Sex
  activityLevel: ActivityLevel
  sexOffset: number
  bmr: number
  multiplier: number
  tdee: number
}

function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null

  const birth = new Date(dateOfBirth)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return age >= 0 ? age : null
}

function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function getCalorieBreakdown(
  profile: UserProfile,
): CalorieBreakdown | null {
  const { heightCm, weightKg, dateOfBirth, activityLevel, sex } = profile

  if (heightCm == null || weightKg == null || !dateOfBirth || !sex) return null

  const age = getAge(dateOfBirth)
  if (age == null) return null

  const bmr = calculateBmr(weightKg, heightCm, age, sex)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]
  const sexOffset = sex === 'male' ? 5 : -161

  return {
    age,
    weightKg,
    heightCm,
    sex,
    activityLevel,
    sexOffset,
    bmr: Math.round(bmr),
    multiplier,
    tdee: Math.round(bmr * multiplier),
  }
}

export function calculateDailyCalories(profile: UserProfile): number | null {
  return getCalorieBreakdown(profile)?.tdee ?? null
}
