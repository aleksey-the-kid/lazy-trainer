import type {
  ExerciseSetHistory,
  WorkoutExerciseSession,
  WorkoutHistoryEntry,
  WorkoutSession,
  WorkoutTemplate,
} from '@/db'
import { db } from '@/db'
import { checkAchievements } from '@/lib/achievements'
import {
  calculateSessionVolume,
  createId,
  knownExerciseId,
  normalizeExerciseName,
  todayDateString,
} from '@/lib/workout-utils'
import {
  mirrorExerciseSetHistoryUpsert,
  mirrorKnownExerciseUpsert,
  mirrorWorkoutHistoryUpsert,
  mirrorWorkoutSessionUpsert,
} from '@/lib/supabase/sync'

function cloneTemplateToSession(template: WorkoutTemplate): WorkoutExerciseSession[] {
  if (template.type === 'cardio') return []

  return template.exercises.map((exercise) => ({
    id: createId(),
    name: exercise.name,
    doubleStats: exercise.doubleStats,
    sets: exercise.sets.map((set) => ({
      id: createId(),
      weightKg: set.weightKg,
      reps: set.reps,
      completed: false,
    })),
  }))
}

export async function getActiveSession(
  userId: string,
): Promise<WorkoutSession | undefined> {
  return db.workoutSessions
    .where('[userId+status]')
    .equals([userId, 'active'])
    .first()
}

export async function getSession(
  sessionId: string,
): Promise<WorkoutSession | undefined> {
  return db.workoutSessions.get(sessionId)
}

export async function startWorkout(
  userId: string,
  template: WorkoutTemplate,
): Promise<WorkoutSession> {
  const existing = await getActiveSession(userId)
  if (existing) {
    throw new Error('ACTIVE_SESSION_EXISTS')
  }

  const session: WorkoutSession = {
    id: createId(),
    userId,
    templateId: template.id,
    templateName: template.name,
    type: template.type,
    cardioDurationMinutes: template.cardioDurationMinutes,
    cardioEquipment: template.cardioEquipment,
    cardioCompleted: false,
    status: 'active',
    startedAt: new Date(),
    exercises: cloneTemplateToSession(template),
  }

  await db.workoutSessions.put(session)
  mirrorWorkoutSessionUpsert(session)
  return session
}

export async function toggleSetComplete(
  sessionId: string,
  exerciseIdParam: string,
  setId: string,
  completed: boolean,
): Promise<WorkoutSession | undefined> {
  const session = await getSession(sessionId)
  if (!session) return undefined

  const exercises = session.exercises.map((exercise) => {
    if (exercise.id !== exerciseIdParam) return exercise

    return {
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.id === setId ? { ...set, completed } : set,
      ),
    }
  })

  const updated: WorkoutSession = { ...session, exercises }
  await db.workoutSessions.put(updated)
  mirrorWorkoutSessionUpsert(updated)
  return updated
}

export async function toggleCardioComplete(
  sessionId: string,
  completed: boolean,
): Promise<WorkoutSession | undefined> {
  const session = await getSession(sessionId)
  if (!session || session.type !== 'cardio') return undefined

  const updated: WorkoutSession = { ...session, cardioCompleted: completed }
  await db.workoutSessions.put(updated)
  mirrorWorkoutSessionUpsert(updated)
  return updated
}

export async function updateSessionExercises(
  sessionId: string,
  exercises: WorkoutSession['exercises'],
): Promise<WorkoutSession | undefined> {
  const session = await getSession(sessionId)
  if (!session) return undefined

  const updated: WorkoutSession = { ...session, exercises }
  await db.workoutSessions.put(updated)
  mirrorWorkoutSessionUpsert(updated)
  return updated
}

export async function completeWorkout(
  sessionId: string,
  note: string | null = null,
): Promise<WorkoutHistoryEntry | undefined> {
  const session = await getSession(sessionId)
  if (!session || session.status !== 'active') return undefined

  const completedAt = new Date()
  const date = todayDateString()

  const completedSession: WorkoutSession = {
    ...session,
    status: 'completed',
    completedAt,
  }
  await db.workoutSessions.put(completedSession)
  mirrorWorkoutSessionUpsert(completedSession)

  const historyEntry: WorkoutHistoryEntry = {
    id: createId(),
    userId: session.userId,
    templateId: session.templateId,
    templateName: session.templateName,
    sessionId: session.id,
    workoutType: session.type,
    completedAt,
    totalVolumeKg:
      session.type === 'strength'
        ? calculateSessionVolume(session.exercises)
        : null,
    cardioDurationMinutes: session.cardioDurationMinutes,
    cardioEquipment: session.cardioEquipment,
    note: note?.trim() || null,
  }
  await db.workoutHistory.put(historyEntry)
  mirrorWorkoutHistoryUpsert(historyEntry)

  if (session.type === 'strength') {
    const exerciseHistory: ExerciseSetHistory[] = []
    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        if (!set.completed) continue

        exerciseHistory.push({
          id: createId(),
          userId: session.userId,
          exerciseName: normalizeExerciseName(exercise.name),
          date,
          weightKg: set.weightKg,
          reps:
            set.toFailure && set.actualReps != null && set.actualReps > 0
              ? set.actualReps
              : set.reps,
          sessionId: session.id,
          toFailure: set.toFailure || undefined,
        })
      }
    }

    if (exerciseHistory.length > 0) {
      await db.exerciseSetHistory.bulkPut(exerciseHistory)
      mirrorExerciseSetHistoryUpsert(exerciseHistory)
    }

    for (const exercise of session.exercises) {
      const name = normalizeExerciseName(exercise.name)
      if (!name) continue

      const entry = {
        id: knownExerciseId(session.userId, name),
        userId: session.userId,
        name,
        doubleStats: exercise.doubleStats || undefined,
      }
      await db.knownExercises.put(entry)
      mirrorKnownExerciseUpsert(entry)
    }
  }

  void checkAchievements(session.userId, { notify: true })

  return historyEntry
}

export async function getWorkoutHistory(
  userId: string,
): Promise<WorkoutHistoryEntry[]> {
  const entries = await db.workoutHistory.where('userId').equals(userId).toArray()
  return entries.sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
  )
}

export async function getWorkoutHistoryEntry(
  historyId: string,
): Promise<WorkoutHistoryEntry | undefined> {
  return db.workoutHistory.get(historyId)
}

export async function getExerciseSetHistoryForSession(
  userId: string,
  sessionId: string,
): Promise<ExerciseSetHistory[]> {
  return db.exerciseSetHistory
    .where('userId')
    .equals(userId)
    .filter((entry) => entry.sessionId === sessionId)
    .toArray()
}

export interface WorkoutHistoryExerciseGroup {
  name: string
  sets: { weightKg: number; reps: number; toFailure?: boolean }[]
}

export async function getWorkoutHistoryDetail(
  userId: string,
  historyId: string,
): Promise<
  | {
      entry: WorkoutHistoryEntry
      exercises: WorkoutHistoryExerciseGroup[]
    }
  | undefined
> {
  const entry = await db.workoutHistory.get(historyId)
  if (!entry || entry.userId !== userId) return undefined

  if (entry.workoutType === 'cardio') {
    return { entry, exercises: [] }
  }

  const session = await getSession(entry.sessionId)
  if (session?.exercises.length) {
    const exercises = session.exercises
      .map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets
          .filter((set) => set.completed)
          .map((set) => ({
            weightKg: set.weightKg,
            reps:
              set.toFailure && set.actualReps != null && set.actualReps > 0
                ? set.actualReps
                : set.reps,
            toFailure: set.toFailure || undefined,
          })),
      }))
      .filter((exercise) => exercise.sets.length > 0)

    if (exercises.length > 0) {
      return { entry, exercises }
    }
  }

  const setHistory = await getExerciseSetHistoryForSession(userId, entry.sessionId)
  const order: string[] = []
  const grouped = new Map<string, { weightKg: number; reps: number; toFailure?: boolean }[]>()

  for (const row of setHistory) {
    if (!grouped.has(row.exerciseName)) {
      grouped.set(row.exerciseName, [])
      order.push(row.exerciseName)
    }
    grouped.get(row.exerciseName)!.push({
      weightKg: row.weightKg,
      reps: row.reps,
      toFailure: row.toFailure || undefined,
    })
  }

  return {
    entry,
    exercises: order.map((name) => ({
      name,
      sets: grouped.get(name) ?? [],
    })),
  }
}

export async function getExerciseSetHistory(
  userId: string,
  exerciseName: string,
): Promise<ExerciseSetHistory[]> {
  const rows = await db.exerciseSetHistory
    .where('[userId+exerciseName]')
    .equals([userId, normalizeExerciseName(exerciseName)])
    .toArray()

  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const byDate = a.row.date.localeCompare(b.row.date)
      if (byDate !== 0) return byDate
      return a.index - b.index
    })
    .map(({ row }) => row)
}

export async function clearWorkoutData(): Promise<void> {
  await db.workoutSessions.clear()
  await db.workoutHistory.clear()
  await db.exerciseSetHistory.clear()
}
