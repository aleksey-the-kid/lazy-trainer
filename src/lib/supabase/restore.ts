import type {
  ActivityLevel,
  AppSettings,
  BodyMeasurementEntry,
  CardioEquipment,
  ExerciseSetHistory,
  KnownExercise,
  Language,
  Sex,
  UserProfile,
  UserAchievement,
  WeightEntry,
  WorkoutExerciseSession,
  WorkoutExerciseTemplate,
  WorkoutHistoryEntry,
  WorkoutSession,
  WorkoutTemplate,
  WorkoutType,
} from '@/db'
import { db } from '@/db'

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

function parseDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string' && value) return new Date(value)
  return new Date()
}

function parseOptionalDate(value: unknown): Date | undefined {
  if (value == null || value === '') return undefined
  return parseDate(value)
}

function parseNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value) || 0
}

function parseOptionalNumber(value: unknown): number | null {
  if (value == null || value === '') return null
  return parseNumber(value)
}

async function fetchByUserId(
  table: string,
  userId: string,
): Promise<Record<string, unknown>[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase.from(table).select('*').eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as Record<string, unknown>[]
}

async function fetchByUserIdSafe(
  table: string,
  userId: string,
): Promise<Record<string, unknown>[]> {
  try {
    return await fetchByUserId(table, userId)
  } catch (error) {
    console.warn(`[supabase] restore ${table} failed:`, error)
    return []
  }
}

function fromProfile(row: Record<string, unknown>): UserProfile {
  return {
    userId: String(row.user_id),
    firstName: String(row.first_name ?? ''),
    lastName: String(row.last_name ?? ''),
    sex: (row.sex as Sex | null) ?? null,
    dateOfBirth: String(row.date_of_birth ?? ''),
    heightCm: parseOptionalNumber(row.height_cm),
    weightKg: parseOptionalNumber(row.weight_kg),
    activityLevel: (row.activity_level as ActivityLevel) ?? 'moderate',
  }
}

function fromWeightEntry(row: Record<string, unknown>): WeightEntry {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    date: String(row.date),
    weightKg: parseNumber(row.weight_kg),
  }
}

function fromBodyMeasurement(row: Record<string, unknown>): BodyMeasurementEntry {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    date: String(row.date),
    neckCm: parseOptionalNumber(row.neck_cm),
    shouldersCm: parseOptionalNumber(row.shoulders_cm),
    chestCm: parseOptionalNumber(row.chest_cm),
    waistCm: parseOptionalNumber(row.waist_cm),
    hipsCm: parseOptionalNumber(row.hips_cm),
    bicepCm: parseOptionalNumber(row.bicep_cm),
    forearmCm: parseOptionalNumber(row.forearm_cm),
    thighCm: parseOptionalNumber(row.thigh_cm),
    abdomenCm: parseOptionalNumber(row.abdomen_cm),
  }
}

function fromWorkoutTemplate(row: Record<string, unknown>): WorkoutTemplate {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: String(row.name),
    type: row.type as WorkoutType,
    cardioDurationMinutes: parseOptionalNumber(row.cardio_duration_minutes),
    cardioEquipment: (row.cardio_equipment as CardioEquipment | null) ?? null,
    exercises: (row.exercises as WorkoutExerciseTemplate[]) ?? [],
    createdAt: parseDate(row.created_at),
    updatedAt: parseDate(row.updated_at),
  }
}

function fromWorkoutSession(row: Record<string, unknown>): WorkoutSession {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    templateId: String(row.template_id),
    templateName: String(row.template_name),
    type: row.type as WorkoutType,
    cardioDurationMinutes: parseOptionalNumber(row.cardio_duration_minutes),
    cardioEquipment: (row.cardio_equipment as CardioEquipment | null) ?? null,
    cardioCompleted: Boolean(row.cardio_completed),
    status: row.status as WorkoutSession['status'],
    startedAt: parseDate(row.started_at),
    completedAt: parseOptionalDate(row.completed_at),
    exercises: (row.exercises as WorkoutExerciseSession[]) ?? [],
  }
}

function fromWorkoutHistory(row: Record<string, unknown>): WorkoutHistoryEntry {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    templateId: String(row.template_id),
    templateName: String(row.template_name),
    sessionId: String(row.session_id),
    workoutType: row.workout_type as WorkoutType,
    completedAt: parseDate(row.completed_at),
    totalVolumeKg: parseOptionalNumber(row.total_volume_kg),
    cardioDurationMinutes: parseOptionalNumber(row.cardio_duration_minutes),
    cardioEquipment: (row.cardio_equipment as CardioEquipment | null) ?? null,
    note: typeof row.note === 'string' ? row.note : null,
  }
}

function fromExerciseSetHistory(row: Record<string, unknown>): ExerciseSetHistory {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    exerciseName: String(row.exercise_name),
    date: String(row.date),
    weightKg: parseNumber(row.weight_kg),
    reps: parseNumber(row.reps),
    sessionId: String(row.session_id),
    toFailure: row.to_failure === true ? true : undefined,
  }
}

function fromKnownExercise(row: Record<string, unknown>): KnownExercise {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: String(row.name),
    doubleStats: row.double_stats === true ? true : undefined,
  }
}

function fromUserAchievement(row: Record<string, unknown>): UserAchievement {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    achievementId: String(row.achievement_id),
    unlockedAt: parseDate(row.unlocked_at),
  }
}

function fromAppSettings(row: Record<string, unknown>): AppSettings {
  return {
    id: 'app',
    language: (row.language as Language) ?? 'ru',
  }
}

async function clearLocalUserData(userId: string): Promise<void> {
  await Promise.all([
    db.profiles.delete(userId).catch(() => undefined),
    db.weightEntries.where('userId').equals(userId).delete(),
    db.bodyMeasurements.where('userId').equals(userId).delete(),
    db.workoutTemplates.where('userId').equals(userId).delete(),
    db.workoutSessions.where('userId').equals(userId).delete(),
    db.workoutHistory.where('userId').equals(userId).delete(),
    db.exerciseSetHistory.where('userId').equals(userId).delete(),
    db.knownExercises.where('userId').equals(userId).delete(),
    db.userAchievements.where('userId').equals(userId).delete(),
  ])
}

export async function restoreRemoteUserIfConfigured(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    await restoreUserFromSupabase(userId)
  } catch (error) {
    console.warn('[supabase] restore failed:', error)
  }
}

export async function restoreUserFromSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const supabase = getSupabase()
  if (!supabase) return

  const [
    profileRows,
    weightRows,
    measurementRows,
    templateRows,
    sessionRows,
    historyRows,
    setHistoryRows,
    knownExerciseRows,
    achievementRows,
    settingsResult,
  ] = await Promise.all([
    fetchByUserIdSafe('profiles', userId),
    fetchByUserIdSafe('weight_entries', userId),
    fetchByUserIdSafe('body_measurements', userId),
    fetchByUserIdSafe('workout_templates', userId),
    fetchByUserIdSafe('workout_sessions', userId),
    fetchByUserIdSafe('workout_history', userId),
    fetchByUserIdSafe('exercise_set_history', userId),
    fetchByUserIdSafe('known_exercises', userId),
    fetchByUserIdSafe('user_achievements', userId),
    supabase.from('app_settings').select('*').eq('id', 'app').maybeSingle(),
  ])

  if (settingsResult.error) {
    console.warn('[supabase] restore app_settings failed:', settingsResult.error)
  }

  const profile = profileRows[0] ? fromProfile(profileRows[0]) : null
  const weightEntries = weightRows.map(fromWeightEntry)
  const bodyMeasurements = measurementRows.map(fromBodyMeasurement)
  const workoutTemplates = templateRows.map(fromWorkoutTemplate)
  const workoutSessions = sessionRows.map(fromWorkoutSession)
  const workoutHistory = historyRows.map(fromWorkoutHistory)
  const exerciseSetHistory = setHistoryRows.map(fromExerciseSetHistory)
  const knownExercises = knownExerciseRows.map(fromKnownExercise)
  const userAchievements = achievementRows.map(fromUserAchievement)
  const appSettings = settingsResult.data ? fromAppSettings(settingsResult.data) : null

  await db.transaction(
    'rw',
    [
      db.profiles,
      db.weightEntries,
      db.bodyMeasurements,
      db.workoutTemplates,
      db.workoutSessions,
      db.workoutHistory,
      db.exerciseSetHistory,
      db.knownExercises,
      db.userAchievements,
      db.settings,
    ],
    async () => {
      await clearLocalUserData(userId)

      if (profile) await db.profiles.put(profile)
      if (weightEntries.length) await db.weightEntries.bulkPut(weightEntries)
      if (bodyMeasurements.length) await db.bodyMeasurements.bulkPut(bodyMeasurements)
      if (workoutTemplates.length) await db.workoutTemplates.bulkPut(workoutTemplates)
      if (workoutSessions.length) await db.workoutSessions.bulkPut(workoutSessions)
      if (workoutHistory.length) await db.workoutHistory.bulkPut(workoutHistory)
      if (exerciseSetHistory.length) await db.exerciseSetHistory.bulkPut(exerciseSetHistory)
      if (knownExercises.length) await db.knownExercises.bulkPut(knownExercises)
      if (userAchievements.length) await db.userAchievements.bulkPut(userAchievements)
      if (appSettings) await db.settings.put(appSettings)
    },
  )
}
