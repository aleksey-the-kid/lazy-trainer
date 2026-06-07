import { db } from '@/db'
import type {
  ExerciseSetHistory,
  KnownExercise,
  WorkoutHistoryEntry,
  WorkoutSession,
  WorkoutTemplate,
} from '@/db'
import { exerciseKey, normalizeExerciseName } from '@/lib/workout-utils'
import {
  mirrorImportWorkoutData,
  mirrorUserWorkoutDataDelete,
} from '@/lib/supabase/sync'

export const WORKOUT_EXPORT_VERSION = 1

export interface WorkoutDataExport {
  version: typeof WORKOUT_EXPORT_VERSION
  exportedAt: string
  userId: string
  workoutTemplates: WorkoutTemplate[]
  workoutSessions: WorkoutSession[]
  workoutHistory: WorkoutHistoryEntry[]
  exerciseSetHistory: ExerciseSetHistory[]
  knownExercises: KnownExercise[]
}

function parseDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value
  if (typeof value === 'string' && value) return new Date(value)
  return undefined
}

export async function exportUserWorkoutData(userId: string): Promise<WorkoutDataExport> {
  const [
    workoutTemplates,
    workoutSessions,
    workoutHistory,
    exerciseSetHistory,
    knownExercises,
  ] = await Promise.all([
    db.workoutTemplates.where('userId').equals(userId).toArray(),
    db.workoutSessions.where('userId').equals(userId).toArray(),
    db.workoutHistory.where('userId').equals(userId).toArray(),
    db.exerciseSetHistory.where('userId').equals(userId).toArray(),
    db.knownExercises.where('userId').equals(userId).toArray(),
  ])

  return {
    version: WORKOUT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    userId,
    workoutTemplates,
    workoutSessions,
    workoutHistory,
    exerciseSetHistory,
    knownExercises,
  }
}

export function downloadWorkoutExport(data: WorkoutDataExport, userId: string): void {
  const date = new Date().toISOString().slice(0, 10)
  const filename = `lazy-trainer-workouts-${userId.slice(0, 8)}-${date}.json`
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function clearUserWorkoutData(userId: string): Promise<void> {
  await Promise.all([
    db.workoutTemplates.where('userId').equals(userId).delete(),
    db.workoutSessions.where('userId').equals(userId).delete(),
    db.workoutHistory.where('userId').equals(userId).delete(),
    db.exerciseSetHistory.where('userId').equals(userId).delete(),
    db.knownExercises.where('userId').equals(userId).delete(),
  ])
  mirrorUserWorkoutDataDelete(userId)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function assertArray(data: Record<string, unknown>, key: string): unknown[] {
  const value = data[key]
  if (!Array.isArray(value)) {
    throw new Error(`INVALID_EXPORT:${key}`)
  }
  return value
}

function normalizeTemplate(
  raw: unknown,
  userId: string,
): WorkoutTemplate {
  if (!isRecord(raw) || typeof raw.id !== 'string' || typeof raw.name !== 'string') {
    throw new Error('INVALID_EXPORT:template')
  }

  const createdAt = parseDate(raw.createdAt) ?? new Date()
  const updatedAt = parseDate(raw.updatedAt) ?? createdAt
  const type = raw.type === 'cardio' ? 'cardio' : 'strength'

  return {
    id: raw.id,
    userId,
    name: raw.name,
    type,
    cardioDurationMinutes:
      type === 'cardio' ? Number(raw.cardioDurationMinutes) || 0 : null,
    cardioEquipment:
      type === 'cardio' &&
      (raw.cardioEquipment === 'bike' ||
        raw.cardioEquipment === 'treadmill' ||
        raw.cardioEquipment === 'elliptical')
        ? raw.cardioEquipment
        : null,
    exercises: type === 'strength' && Array.isArray(raw.exercises) ? raw.exercises : [],
    createdAt,
    updatedAt,
  } as WorkoutTemplate
}

function normalizeSession(raw: unknown, userId: string): WorkoutSession {
  if (!isRecord(raw) || typeof raw.id !== 'string') {
    throw new Error('INVALID_EXPORT:session')
  }

  const type = raw.type === 'cardio' ? 'cardio' : 'strength'
  const startedAt = parseDate(raw.startedAt) ?? new Date()
  const completedAt = parseDate(raw.completedAt)

  return {
    id: raw.id,
    userId,
    templateId: String(raw.templateId ?? ''),
    templateName: String(raw.templateName ?? ''),
    type,
    cardioDurationMinutes:
      raw.cardioDurationMinutes != null ? Number(raw.cardioDurationMinutes) : null,
    cardioEquipment:
      raw.cardioEquipment === 'bike' ||
      raw.cardioEquipment === 'treadmill' ||
      raw.cardioEquipment === 'elliptical'
        ? raw.cardioEquipment
        : null,
    cardioCompleted: Boolean(raw.cardioCompleted),
    status: raw.status === 'active' ? 'active' : 'completed',
    startedAt,
    completedAt,
    exercises: Array.isArray(raw.exercises) ? raw.exercises : [],
  } as WorkoutSession
}

function normalizeHistory(raw: unknown, userId: string): WorkoutHistoryEntry {
  if (!isRecord(raw) || typeof raw.id !== 'string') {
    throw new Error('INVALID_EXPORT:history')
  }

  const workoutType = raw.workoutType === 'cardio' ? 'cardio' : 'strength'

  return {
    id: raw.id,
    userId,
    templateId: String(raw.templateId ?? ''),
    templateName: String(raw.templateName ?? ''),
    sessionId: String(raw.sessionId ?? ''),
    workoutType,
    completedAt: parseDate(raw.completedAt) ?? new Date(),
    totalVolumeKg:
      raw.totalVolumeKg != null ? Number(raw.totalVolumeKg) : null,
    cardioDurationMinutes:
      raw.cardioDurationMinutes != null ? Number(raw.cardioDurationMinutes) : null,
    cardioEquipment:
      raw.cardioEquipment === 'bike' ||
      raw.cardioEquipment === 'treadmill' ||
      raw.cardioEquipment === 'elliptical'
        ? raw.cardioEquipment
        : null,
    note: typeof raw.note === 'string' && raw.note.trim() ? raw.note.trim() : null,
  }
}

function normalizeSetHistory(raw: unknown, userId: string): ExerciseSetHistory {
  if (!isRecord(raw) || typeof raw.id !== 'string') {
    throw new Error('INVALID_EXPORT:setHistory')
  }

  const name = normalizeExerciseName(String(raw.exerciseName ?? ''))
  if (!name) throw new Error('INVALID_EXPORT:exerciseName')

  return {
    id: raw.id,
    userId,
    exerciseName: name,
    date: String(raw.date ?? ''),
    weightKg: Number(raw.weightKg) || 0,
    reps: Number(raw.reps) || 0,
    sessionId: String(raw.sessionId ?? ''),
    toFailure: raw.toFailure === true ? true : undefined,
  }
}

function normalizeKnownExercise(raw: unknown, userId: string): KnownExercise {
  if (!isRecord(raw)) throw new Error('INVALID_EXPORT:knownExercise')

  const name = normalizeExerciseName(String(raw.name ?? raw.exerciseName ?? ''))
  if (!name) throw new Error('INVALID_EXPORT:knownExerciseName')

  return {
    id: `${userId}_${exerciseKey(name)}`,
    userId,
    name,
    doubleStats: raw.doubleStats === true ? true : undefined,
  }
}

function historyDateKey(completedAt: Date): string {
  const year = completedAt.getFullYear()
  const month = String(completedAt.getMonth() + 1).padStart(2, '0')
  const day = String(completedAt.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function collectImportDates(
  workoutHistory: WorkoutHistoryEntry[],
  exerciseSetHistory: ExerciseSetHistory[],
): Set<string> {
  const dates = new Set<string>()

  for (const entry of workoutHistory) {
    dates.add(historyDateKey(entry.completedAt))
  }

  for (const row of exerciseSetHistory) {
    if (row.date) dates.add(row.date)
  }

  return dates
}

async function removeExistingDataForImportDates(
  userId: string,
  dates: Set<string>,
): Promise<{
  deletedHistoryIds: string[]
  deletedSetIds: string[]
  deletedSessionIds: string[]
}> {
  if (dates.size === 0) {
    return { deletedHistoryIds: [], deletedSetIds: [], deletedSessionIds: [] }
  }

  const existingHistory = await db.workoutHistory
    .where('userId')
    .equals(userId)
    .toArray()

  const removedHistory = existingHistory.filter((entry) =>
    dates.has(historyDateKey(entry.completedAt)),
  )
  const removedSessionIds = new Set(
    removedHistory.map((entry) => entry.sessionId).filter(Boolean),
  )

  await Promise.all(removedHistory.map((entry) => db.workoutHistory.delete(entry.id)))

  const existingSets = await db.exerciseSetHistory
    .where('userId')
    .equals(userId)
    .toArray()

  const removedSets = existingSets.filter(
    (row) => dates.has(row.date) || removedSessionIds.has(row.sessionId),
  )

  await Promise.all(removedSets.map((row) => db.exerciseSetHistory.delete(row.id)))

  await Promise.all(
    [...removedSessionIds].map((sessionId) => db.workoutSessions.delete(sessionId)),
  )

  return {
    deletedHistoryIds: removedHistory.map((entry) => entry.id),
    deletedSetIds: removedSets.map((row) => row.id),
    deletedSessionIds: [...removedSessionIds],
  }
}

function mergeKnownExercises(
  existing: KnownExercise[],
  imported: KnownExercise[],
): KnownExercise[] {
  const map = new Map<string, KnownExercise>()

  for (const item of existing) {
    map.set(exerciseKey(item.name), item)
  }

  for (const item of imported) {
    const key = exerciseKey(item.name)
    const previous = map.get(key)
    map.set(key, {
      ...previous,
      ...item,
      id: item.id,
      name: item.name,
      doubleStats: item.doubleStats ?? previous?.doubleStats,
    })
  }

  return [...map.values()]
}

async function mergeTemplatesOnImport(
  _userId: string,
  imported: WorkoutTemplate[],
): Promise<void> {
  if (imported.length > 0) {
    await db.workoutTemplates.bulkPut(imported)
  }
}

async function mergeSessionsOnImport(
  _userId: string,
  imported: WorkoutSession[],
  _removedSessionIds: Set<string>,
): Promise<void> {
  if (imported.length > 0) {
    await db.workoutSessions.bulkPut(imported)
  }
}

function buildKnownExercisesFromImport(
  explicit: KnownExercise[],
  templates: WorkoutTemplate[],
  setHistory: ExerciseSetHistory[],
): KnownExercise[] {
  const map = new Map<string, KnownExercise>()

  for (const item of explicit) {
    map.set(exerciseKey(item.name), item)
  }

  for (const template of templates) {
    if (template.type !== 'strength') continue
    for (const exercise of template.exercises) {
      const name = normalizeExerciseName(exercise.name)
      if (!name) continue
      const key = exerciseKey(name)
      const previous = map.get(key)
      map.set(key, {
        id: `${template.userId}_${key}`,
        userId: template.userId,
        name,
        doubleStats: exercise.doubleStats ?? previous?.doubleStats,
      })
    }
  }

  for (const entry of setHistory) {
    const key = exerciseKey(entry.exerciseName)
    const previous = map.get(key)
    map.set(key, {
      id: `${entry.userId}_${key}`,
      userId: entry.userId,
      name: entry.exerciseName,
      doubleStats: previous?.doubleStats,
    })
  }

  return [...map.values()]
}

export async function importUserWorkoutData(
  userId: string,
  file: File,
): Promise<{ counts: Record<string, number> }> {
  const text = await file.text()
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('INVALID_JSON')
  }

  if (!isRecord(parsed)) throw new Error('INVALID_EXPORT:root')

  if (parsed.version !== WORKOUT_EXPORT_VERSION) {
    throw new Error('INVALID_VERSION')
  }

  const templateRaw = assertArray(parsed, 'workoutTemplates')
  const sessionRaw = assertArray(parsed, 'workoutSessions')
  const historyRaw = assertArray(parsed, 'workoutHistory')
  const setHistoryRaw = assertArray(parsed, 'exerciseSetHistory')
  const knownRaw = assertArray(parsed, 'knownExercises')

  const workoutTemplates = templateRaw.map((item) => normalizeTemplate(item, userId))
  const workoutSessions = sessionRaw.map((item) => normalizeSession(item, userId))
  const workoutHistory = historyRaw.map((item) => normalizeHistory(item, userId))
  const exerciseSetHistory = setHistoryRaw.map((item) =>
    normalizeSetHistory(item, userId),
  )
  const knownFromFile = knownRaw.map((item) => normalizeKnownExercise(item, userId))
  const knownExercisesFromImport = buildKnownExercisesFromImport(
    knownFromFile,
    workoutTemplates,
    exerciseSetHistory,
  )

  const importDates = collectImportDates(workoutHistory, exerciseSetHistory)

  let deletedHistoryIds: string[] = []
  let deletedSetIds: string[] = []
  let deletedSessionIds: string[] = []
  let mergedKnown: KnownExercise[] = []

  await db.transaction(
    'rw',
    [
      db.workoutTemplates,
      db.workoutSessions,
      db.workoutHistory,
      db.exerciseSetHistory,
      db.knownExercises,
    ],
    async () => {
      const removed = await removeExistingDataForImportDates(userId, importDates)
      deletedHistoryIds = removed.deletedHistoryIds
      deletedSetIds = removed.deletedSetIds
      deletedSessionIds = removed.deletedSessionIds

      if (workoutTemplates.length) {
        await mergeTemplatesOnImport(userId, workoutTemplates)
      }

      await mergeSessionsOnImport(
        userId,
        workoutSessions,
        new Set(removed.deletedSessionIds),
      )

      if (workoutHistory.length) await db.workoutHistory.bulkPut(workoutHistory)
      if (exerciseSetHistory.length) {
        await db.exerciseSetHistory.bulkPut(exerciseSetHistory)
      }

      const existingKnown = await db.knownExercises
        .where('userId')
        .equals(userId)
        .toArray()
      mergedKnown = mergeKnownExercises(existingKnown, knownExercisesFromImport)
      if (mergedKnown.length) await db.knownExercises.bulkPut(mergedKnown)
    },
  )

  mirrorImportWorkoutData({
    templates: workoutTemplates,
    sessions: workoutSessions,
    history: workoutHistory,
    setHistory: exerciseSetHistory,
    knownExercises: mergedKnown,
    deletedHistoryIds,
    deletedSetIds,
    deletedSessionIds,
  })

  return {
    counts: {
      workoutTemplates: workoutTemplates.length,
      workoutSessions: workoutSessions.length,
      workoutHistory: workoutHistory.length,
      exerciseSetHistory: exerciseSetHistory.length,
      knownExercises: knownExercisesFromImport.length,
    },
  }
}
