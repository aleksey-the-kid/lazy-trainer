import Dexie, { type EntityTable } from 'dexie'

import { exerciseKey, knownExerciseId, normalizeExerciseName } from '@/lib/workout-utils'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive'

export type Language = 'en' | 'ru'

export interface User {
  id: string
  email: string
  name: string
  picture: string
  loggedInAt: Date
}

export type Sex = 'male' | 'female'

export interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  sex: Sex | null
  dateOfBirth: string
  heightCm: number | null
  weightKg: number | null
  activityLevel: ActivityLevel
}

export interface WeightEntry {
  id: string
  userId: string
  date: string
  weightKg: number
}

export const BODY_MEASUREMENT_FIELDS = [
  'neckCm',
  'shouldersCm',
  'chestCm',
  'waistCm',
  'hipsCm',
  'bicepCm',
  'forearmCm',
  'thighCm',
  'abdomenCm',
] as const

export type BodyMeasurementField = (typeof BODY_MEASUREMENT_FIELDS)[number]

export interface BodyMeasurementEntry {
  id: string
  userId: string
  date: string
  neckCm: number | null
  shouldersCm: number | null
  chestCm: number | null
  waistCm: number | null
  hipsCm: number | null
  bicepCm: number | null
  forearmCm: number | null
  thighCm: number | null
  abdomenCm: number | null
}

export type WorkoutType = 'strength' | 'cardio'

export type CardioEquipment = 'bike' | 'treadmill' | 'elliptical'

export interface WorkoutSetTemplate {
  id: string
  weightKg: number
  reps: number
  toFailure?: boolean
}

export interface WorkoutExerciseTemplate {
  id: string
  name: string
  sets: WorkoutSetTemplate[]
  doubleStats?: boolean
}

export interface WorkoutTemplate {
  id: string
  userId: string
  name: string
  type: WorkoutType
  cardioDurationMinutes: number | null
  cardioEquipment: CardioEquipment | null
  exercises: WorkoutExerciseTemplate[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutSetSession {
  id: string
  weightKg: number
  reps: number
  completed: boolean
  toFailure?: boolean
  actualReps?: number
}

export interface WorkoutExerciseSession {
  id: string
  name: string
  sets: WorkoutSetSession[]
  doubleStats?: boolean
}

export interface WorkoutSession {
  id: string
  userId: string
  templateId: string
  templateName: string
  type: WorkoutType
  cardioDurationMinutes: number | null
  cardioEquipment: CardioEquipment | null
  cardioCompleted: boolean
  status: 'active' | 'completed'
  startedAt: Date
  completedAt?: Date
  exercises: WorkoutExerciseSession[]
}

export interface WorkoutHistoryEntry {
  id: string
  userId: string
  templateId: string
  templateName: string
  sessionId: string
  workoutType: WorkoutType
  completedAt: Date
  totalVolumeKg: number | null
  cardioDurationMinutes: number | null
  cardioEquipment: CardioEquipment | null
  note: string | null
}

export interface ExerciseSetHistory {
  id: string
  userId: string
  exerciseName: string
  date: string
  weightKg: number
  reps: number
  sessionId: string
  toFailure?: boolean
}

export interface KnownExercise {
  id: string
  userId: string
  name: string
  doubleStats?: boolean
}

export interface AppSettings {
  id: 'app'
  language: Language
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
}

const db = new Dexie('LazyTrainerDB') as Dexie & {
  users: EntityTable<User, 'id'>
  profiles: EntityTable<UserProfile, 'userId'>
  weightEntries: EntityTable<WeightEntry, 'id'>
  bodyMeasurements: EntityTable<BodyMeasurementEntry, 'id'>
  workoutTemplates: EntityTable<WorkoutTemplate, 'id'>
  workoutSessions: EntityTable<WorkoutSession, 'id'>
  workoutHistory: EntityTable<WorkoutHistoryEntry, 'id'>
  exerciseSetHistory: EntityTable<ExerciseSetHistory, 'id'>
  knownExercises: EntityTable<KnownExercise, 'id'>
  settings: EntityTable<AppSettings, 'id'>
  userAchievements: EntityTable<UserAchievement, 'id'>
}

db.version(1).stores({
  users: 'id, email',
})

db.version(2).stores({
  users: 'id, email',
  profiles: 'userId',
  settings: 'id',
})

db.version(3).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  settings: 'id',
})

db.version(4).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
})

db.version(5).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  await tx
    .table('workoutTemplates')
    .toCollection()
    .modify((template: WorkoutTemplate) => {
      template.type ??= 'strength'
      template.cardioDurationMinutes ??= null
      template.cardioEquipment ??= null
    })

  await tx
    .table('workoutSessions')
    .toCollection()
    .modify((session: WorkoutSession) => {
      session.type ??= 'strength'
      session.cardioDurationMinutes ??= null
      session.cardioEquipment ??= null
      session.cardioCompleted ??= false
    })

  await tx
    .table('workoutHistory')
    .toCollection()
    .modify((entry: WorkoutHistoryEntry) => {
      entry.workoutType ??= 'strength'
      entry.cardioDurationMinutes ??= null
      entry.cardioEquipment ??= null
      if (entry.totalVolumeKg === undefined) {
        entry.totalVolumeKg = 0
      }
    })
})

db.version(6).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  await tx
    .table('profiles')
    .toCollection()
    .modify((profile: UserProfile) => {
      profile.sex ??= null
    })
})

db.version(7).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
})

db.version(8).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  const knownTable = tx.table('knownExercises')
  const allKnown = (await knownTable.toArray()) as KnownExercise[]
  const merged = new Map<string, KnownExercise>()

  for (const item of allKnown) {
    const name = normalizeExerciseName(item.name)
    if (!name) continue

    const mergeKey = `${item.userId}::${exerciseKey(name)}`
    const previous = merged.get(mergeKey)

    merged.set(mergeKey, {
      id: knownExerciseId(item.userId, name),
      userId: item.userId,
      name,
      doubleStats: item.doubleStats || previous?.doubleStats,
    })
  }

  await knownTable.clear()
  if (merged.size > 0) {
    await knownTable.bulkPut([...merged.values()])
  }

  await tx
    .table('exerciseSetHistory')
    .toCollection()
    .modify((row: ExerciseSetHistory) => {
      row.exerciseName = normalizeExerciseName(row.exerciseName)
    })
})

db.version(9).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  bodyMeasurements: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
})

db.version(10).stores({
  users: 'id, email',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  bodyMeasurements: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  await tx
    .table('bodyMeasurements')
    .toCollection()
    .modify((entry: BodyMeasurementEntry & { calfCm?: number | null }) => {
      if (entry.abdomenCm == null && entry.calfCm != null) {
        entry.abdomenCm = entry.calfCm
      }
      delete entry.calfCm
    })
})

db.version(11).stores({
  users: 'id, email, loggedInAt',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  bodyMeasurements: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  await tx
    .table('users')
    .toCollection()
    .modify((user: User) => {
      if (!user.loggedInAt) {
        user.loggedInAt = new Date()
      }
    })
})

db.version(12).stores({
  users: 'id, email, loggedInAt',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  bodyMeasurements: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
}).upgrade(async (tx) => {
  await tx
    .table('workoutHistory')
    .toCollection()
    .modify((entry: WorkoutHistoryEntry) => {
      entry.note ??= null
    })
})

db.version(13).stores({
  users: 'id, email, loggedInAt',
  profiles: 'userId',
  weightEntries: 'id, userId, date',
  bodyMeasurements: 'id, userId, date',
  workoutTemplates: 'id, userId, updatedAt, type',
  workoutSessions: 'id, userId, status, startedAt, [userId+status]',
  workoutHistory: 'id, userId, completedAt',
  exerciseSetHistory: 'id, userId, exerciseName, date, [userId+exerciseName]',
  knownExercises: 'id, userId',
  settings: 'id',
  userAchievements: 'id, userId, achievementId',
})

export { db }
