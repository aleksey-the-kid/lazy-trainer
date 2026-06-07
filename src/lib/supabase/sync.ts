import type {
  AppSettings,
  BodyMeasurementEntry,
  ExerciseSetHistory,
  KnownExercise,
  User,
  UserProfile,
  WeightEntry,
  WorkoutHistoryEntry,
  WorkoutSession,
  WorkoutTemplate,
} from '@/db'
import { db } from '@/db'

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

function mirror(operation: () => Promise<void>): void {
  if (!getSupabase()) return

  void operation().catch((error) => {
    console.warn('[supabase] sync failed:', error)
  })
}

function toIso(date: Date | undefined): string | null {
  return date ? date.toISOString() : null
}

async function upsertRow(table: string, row: Record<string, unknown>): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from(table).upsert(row)
  if (error) throw error
}

async function upsertRows(table: string, rows: Record<string, unknown>[]): Promise<void> {
  if (rows.length === 0) return

  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from(table).upsert(rows)
  if (error) throw error
}

async function deleteById(table: string, id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

async function deleteByUserId(table: string, userId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from(table).delete().eq('user_id', userId)
  if (error) throw error
}

async function deleteProfile(userId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from('profiles').delete().eq('user_id', userId)
  if (error) throw error
}

async function wipeSupabaseUserData(userId: string): Promise<void> {
  await Promise.all([
    deleteProfile(userId),
    deleteByUserId('weight_entries', userId),
    deleteByUserId('body_measurements', userId),
    deleteByUserId('workout_templates', userId),
    deleteByUserId('workout_sessions', userId),
    deleteByUserId('workout_history', userId),
    deleteByUserId('exercise_set_history', userId),
    deleteByUserId('known_exercises', userId),
    deleteById('users', userId),
  ])
}

function mapUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    logged_in_at: user.loggedInAt.toISOString(),
  }
}

function mapProfile(profile: UserProfile) {
  return {
    user_id: profile.userId,
    first_name: profile.firstName,
    last_name: profile.lastName,
    sex: profile.sex,
    date_of_birth: profile.dateOfBirth,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    activity_level: profile.activityLevel,
  }
}

function mapWeightEntry(entry: WeightEntry) {
  return {
    id: entry.id,
    user_id: entry.userId,
    date: entry.date,
    weight_kg: entry.weightKg,
  }
}

function mapBodyMeasurement(entry: BodyMeasurementEntry) {
  return {
    id: entry.id,
    user_id: entry.userId,
    date: entry.date,
    neck_cm: entry.neckCm,
    shoulders_cm: entry.shouldersCm,
    chest_cm: entry.chestCm,
    waist_cm: entry.waistCm,
    hips_cm: entry.hipsCm,
    bicep_cm: entry.bicepCm,
    forearm_cm: entry.forearmCm,
    thigh_cm: entry.thighCm,
    abdomen_cm: entry.abdomenCm,
  }
}

function mapWorkoutTemplate(template: WorkoutTemplate) {
  return {
    id: template.id,
    user_id: template.userId,
    name: template.name,
    type: template.type,
    cardio_duration_minutes: template.cardioDurationMinutes,
    cardio_equipment: template.cardioEquipment,
    exercises: template.exercises,
    created_at: template.createdAt.toISOString(),
    updated_at: template.updatedAt.toISOString(),
  }
}

function mapWorkoutSession(session: WorkoutSession) {
  return {
    id: session.id,
    user_id: session.userId,
    template_id: session.templateId,
    template_name: session.templateName,
    type: session.type,
    cardio_duration_minutes: session.cardioDurationMinutes,
    cardio_equipment: session.cardioEquipment,
    cardio_completed: session.cardioCompleted,
    status: session.status,
    started_at: session.startedAt.toISOString(),
    completed_at: toIso(session.completedAt),
    exercises: session.exercises,
  }
}

function mapWorkoutHistory(entry: WorkoutHistoryEntry) {
  return {
    id: entry.id,
    user_id: entry.userId,
    template_id: entry.templateId,
    template_name: entry.templateName,
    session_id: entry.sessionId,
    workout_type: entry.workoutType,
    completed_at: entry.completedAt.toISOString(),
    total_volume_kg: entry.totalVolumeKg,
    cardio_duration_minutes: entry.cardioDurationMinutes,
    cardio_equipment: entry.cardioEquipment,
    note: entry.note,
  }
}

function mapExerciseSetHistory(entry: ExerciseSetHistory) {
  return {
    id: entry.id,
    user_id: entry.userId,
    exercise_name: entry.exerciseName,
    date: entry.date,
    weight_kg: entry.weightKg,
    reps: entry.reps,
    session_id: entry.sessionId,
    to_failure: entry.toFailure ?? null,
  }
}

function mapKnownExercise(exercise: KnownExercise) {
  return {
    id: exercise.id,
    user_id: exercise.userId,
    name: exercise.name,
    double_stats: exercise.doubleStats ?? null,
  }
}

function mapAppSettings(settings: AppSettings) {
  return {
    id: settings.id,
    language: settings.language,
  }
}

export function mirrorUserUpsert(user: User): void {
  mirror(async () => upsertRow('users', mapUser(user)))
}

export function mirrorUserDelete(userId: string): void {
  mirror(async () => deleteById('users', userId))
}

export function mirrorProfileUpsert(profile: UserProfile): void {
  mirror(async () => upsertRow('profiles', mapProfile(profile)))
}

export function mirrorWeightEntryUpsert(entry: WeightEntry): void {
  mirror(async () => upsertRow('weight_entries', mapWeightEntry(entry)))
}

export function mirrorBodyMeasurementUpsert(entry: BodyMeasurementEntry): void {
  mirror(async () => upsertRow('body_measurements', mapBodyMeasurement(entry)))
}

export function mirrorWorkoutTemplateUpsert(template: WorkoutTemplate): void {
  mirror(async () => upsertRow('workout_templates', mapWorkoutTemplate(template)))
}

export function mirrorWorkoutTemplateDelete(templateId: string): void {
  mirror(async () => deleteById('workout_templates', templateId))
}

export function mirrorWorkoutSessionUpsert(session: WorkoutSession): void {
  mirror(async () => upsertRow('workout_sessions', mapWorkoutSession(session)))
}

export function mirrorWorkoutSessionDelete(sessionId: string): void {
  mirror(async () => deleteById('workout_sessions', sessionId))
}

export function mirrorWorkoutHistoryUpsert(entry: WorkoutHistoryEntry): void {
  mirror(async () => upsertRow('workout_history', mapWorkoutHistory(entry)))
}

export function mirrorWorkoutHistoryDelete(historyId: string): void {
  mirror(async () => deleteById('workout_history', historyId))
}

export function mirrorExerciseSetHistoryUpsert(entries: ExerciseSetHistory[]): void {
  mirror(async () => upsertRows('exercise_set_history', entries.map(mapExerciseSetHistory)))
}

export function mirrorExerciseSetHistoryDelete(entryId: string): void {
  mirror(async () => deleteById('exercise_set_history', entryId))
}

export function mirrorKnownExerciseUpsert(exercise: KnownExercise): void {
  mirror(async () => upsertRow('known_exercises', mapKnownExercise(exercise)))
}

export function mirrorAppSettingsUpsert(settings: AppSettings): void {
  mirror(async () => upsertRow('app_settings', mapAppSettings(settings)))
}

export function mirrorUserWorkoutDataDelete(userId: string): void {
  mirror(async () => {
    await Promise.all([
      deleteByUserId('workout_templates', userId),
      deleteByUserId('workout_sessions', userId),
      deleteByUserId('workout_history', userId),
      deleteByUserId('exercise_set_history', userId),
      deleteByUserId('known_exercises', userId),
    ])
  })
}

export function mirrorImportWorkoutData(payload: {
  templates: WorkoutTemplate[]
  sessions: WorkoutSession[]
  history: WorkoutHistoryEntry[]
  setHistory: ExerciseSetHistory[]
  knownExercises: KnownExercise[]
  deletedHistoryIds: string[]
  deletedSetIds: string[]
  deletedSessionIds: string[]
}): void {
  mirror(async () => {
    await Promise.all([
      ...payload.deletedHistoryIds.map((id) => deleteById('workout_history', id)),
      ...payload.deletedSetIds.map((id) => deleteById('exercise_set_history', id)),
      ...payload.deletedSessionIds.map((id) => deleteById('workout_sessions', id)),
    ])

    await upsertRows('workout_templates', payload.templates.map(mapWorkoutTemplate))
    await upsertRows('workout_sessions', payload.sessions.map(mapWorkoutSession))
    await upsertRows('workout_history', payload.history.map(mapWorkoutHistory))
    await upsertRows('exercise_set_history', payload.setHistory.map(mapExerciseSetHistory))
    await upsertRows('known_exercises', payload.knownExercises.map(mapKnownExercise))
  })
}

export { isSupabaseConfigured }

export async function pushLocalUserToSupabase(userId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')

  const [
    user,
    profile,
    weightEntries,
    bodyMeasurements,
    workoutTemplates,
    workoutSessions,
    workoutHistory,
    exerciseSetHistory,
    knownExercises,
    appSettings,
  ] = await Promise.all([
    db.users.get(userId),
    db.profiles.get(userId),
    db.weightEntries.where('userId').equals(userId).toArray(),
    db.bodyMeasurements.where('userId').equals(userId).toArray(),
    db.workoutTemplates.where('userId').equals(userId).toArray(),
    db.workoutSessions.where('userId').equals(userId).toArray(),
    db.workoutHistory.where('userId').equals(userId).toArray(),
    db.exerciseSetHistory.where('userId').equals(userId).toArray(),
    db.knownExercises.where('userId').equals(userId).toArray(),
    db.settings.get('app'),
  ])

  await wipeSupabaseUserData(userId)

  if (user) await upsertRow('users', mapUser(user))
  if (profile) await upsertRow('profiles', mapProfile(profile))
  await upsertRows('weight_entries', weightEntries.map(mapWeightEntry))
  await upsertRows('body_measurements', bodyMeasurements.map(mapBodyMeasurement))
  await upsertRows('workout_templates', workoutTemplates.map(mapWorkoutTemplate))
  await upsertRows('workout_sessions', workoutSessions.map(mapWorkoutSession))
  await upsertRows('workout_history', workoutHistory.map(mapWorkoutHistory))
  await upsertRows('exercise_set_history', exerciseSetHistory.map(mapExerciseSetHistory))
  await upsertRows('known_exercises', knownExercises.map(mapKnownExercise))
  if (appSettings) await upsertRow('app_settings', mapAppSettings(appSettings))
}
