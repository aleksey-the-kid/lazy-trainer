import type { ActivityLevel, User, UserProfile } from '@/db'
import { db } from '@/db'
import { recordWeight } from '@/lib/weight-history'
import { mirrorProfileUpsert } from '@/lib/supabase/sync'

function splitGoogleName(name: string): Pick<UserProfile, 'firstName' | 'lastName'> {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

export function createDefaultProfile(user: User): UserProfile {
  const { firstName, lastName } = splitGoogleName(user.name)

  return {
    userId: user.id,
    firstName,
    lastName,
    sex: null,
    dateOfBirth: '',
    heightCm: null,
    weightKg: null,
    activityLevel: 'moderate',
  }
}

export async function getProfile(userId: string): Promise<UserProfile | undefined> {
  return db.profiles.get(userId)
}

export async function ensureProfile(user: User): Promise<UserProfile> {
  const existing = await getProfile(user.id)
  if (existing) return existing

  const profile = createDefaultProfile(user)
  await db.profiles.put(profile)
  mirrorProfileUpsert(profile)
  return profile
}

export async function saveProfile(
  profile: UserProfile,
  previousProfile?: UserProfile,
): Promise<void> {
  await db.profiles.put(profile)
  mirrorProfileUpsert(profile)

  if (
    profile.weightKg != null &&
    profile.weightKg !== previousProfile?.weightKg
  ) {
    await recordWeight(profile.userId, profile.weightKg)
  }
}

export async function clearProfiles(): Promise<void> {
  await db.profiles.clear()
}

export type { ActivityLevel }
