import type { WorkoutExerciseTemplate, WorkoutSetTemplate } from '@/db'
import { db } from '@/db'
import { groupHistoryByDate } from '@/lib/exercise-chart-data'
import { getExerciseSetHistory } from '@/lib/workout-sessions'
import { createId, knownExerciseId, normalizeExerciseName } from '@/lib/workout-utils'

export interface ExercisePreset {
  name: string
  doubleStats?: boolean
  sets: WorkoutSetTemplate[]
}

function cloneSets(sets: WorkoutSetTemplate[]): WorkoutSetTemplate[] {
  return sets.map((set) => ({
    id: createId(),
    weightKg: set.weightKg,
    reps: set.reps,
    toFailure: set.toFailure,
  }))
}

function hasMeaningfulSets(sets: { weightKg: number; reps: number; toFailure?: boolean }[]): boolean {
  return sets.some((set) => set.toFailure || set.weightKg > 0 || set.reps > 0)
}

async function getKnownDoubleStats(
  userId: string,
  exerciseName: string,
): Promise<boolean | undefined> {
  const known = await db.knownExercises.get(knownExerciseId(userId, exerciseName))
  return known?.doubleStats
}

export async function getLastExercisePreset(
  userId: string,
  exerciseName: string,
): Promise<ExercisePreset | null> {
  const normalized = normalizeExerciseName(exerciseName)
  if (!normalized) return null

  const doubleStats = await getKnownDoubleStats(userId, normalized)

  const history = await getExerciseSetHistory(userId, normalized)
  if (history.length > 0) {
    const groups = groupHistoryByDate(history)
    const latestDay = groups.at(-1)
    if (latestDay && latestDay.sets.length > 0) {
      return {
        name: normalized,
        doubleStats,
        sets: latestDay.sets.map((set) => ({
          id: createId(),
          weightKg: set.weightKg,
          reps: set.reps,
        })),
      }
    }
  }

  const sessions = await db.workoutSessions.where('userId').equals(userId).toArray()
  const completed = sessions
    .filter((session) => session.status === 'completed' && session.type === 'strength')
    .sort(
      (a, b) =>
        (b.completedAt?.getTime() ?? b.startedAt.getTime()) -
        (a.completedAt?.getTime() ?? a.startedAt.getTime()),
    )

  for (const session of completed) {
    const exercise = session.exercises.find(
      (item) => normalizeExerciseName(item.name) === normalized,
    )
    if (!exercise) continue

    const completedSets = exercise.sets.filter((set) => set.completed)
    if (!hasMeaningfulSets(completedSets)) continue

    return {
      name: exercise.name,
      doubleStats: exercise.doubleStats ?? doubleStats,
      sets: completedSets.map((set) => ({
        id: createId(),
        weightKg: set.weightKg,
        reps:
          set.toFailure && set.actualReps != null && set.actualReps > 0
            ? set.actualReps
            : set.reps,
        toFailure: set.toFailure,
      })),
    }
  }

  const templates = await db.workoutTemplates.where('userId').equals(userId).toArray()
  templates.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  for (const template of templates) {
    if (template.type !== 'strength') continue

    const exercise = template.exercises.find(
      (item) => normalizeExerciseName(item.name) === normalized,
    )
    if (!exercise || !hasMeaningfulSets(exercise.sets)) continue

    return {
      name: exercise.name,
      doubleStats: exercise.doubleStats ?? doubleStats,
      sets: cloneSets(exercise.sets),
    }
  }

  if (doubleStats) {
    return { name: normalized, doubleStats, sets: [] }
  }

  return null
}

export function applyPresetToExercise(
  exercise: WorkoutExerciseTemplate,
  preset: ExercisePreset | null,
  fallbackName: string,
): WorkoutExerciseTemplate {
  if (preset) {
    return {
      ...exercise,
      name: preset.name,
      doubleStats: preset.doubleStats,
      sets:
        preset.sets.length > 0
          ? preset.sets
          : exercise.sets.length > 0
            ? exercise.sets
            : [{ id: createId(), weightKg: 0, reps: 0 }],
    }
  }

  return {
    ...exercise,
    name: fallbackName,
  }
}
