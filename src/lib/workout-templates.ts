import type {
  CardioEquipment,
  KnownExercise,
  WorkoutExerciseTemplate,
  WorkoutTemplate,
  WorkoutType,
} from '@/db'
import { db } from '@/db'
import { createId, exerciseKey, knownExerciseId, normalizeExerciseName } from '@/lib/workout-utils'
import {
  mirrorKnownExerciseUpsert,
  mirrorWorkoutTemplateDelete,
  mirrorWorkoutTemplateUpsert,
} from '@/lib/supabase/sync'

export type WorkoutTemplateDraft = Omit<
  WorkoutTemplate,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
> & { id?: string }

export function createEmptySet() {
  return { id: createId(), weightKg: 0, reps: 0 }
}

export function createEmptyExercise(): WorkoutExerciseTemplate {
  return { id: createId(), name: '', sets: [createEmptySet()], doubleStats: false }
}

export function createEmptyTemplateDraft(
  type: WorkoutType = 'strength',
  name = '',
): WorkoutTemplateDraft {
  return {
    name,
    type,
    cardioDurationMinutes: type === 'cardio' ? 30 : null,
    cardioEquipment: type === 'cardio' ? 'bike' : null,
    exercises: [],
  }
}

async function registerExerciseNames(
  userId: string,
  exercises: WorkoutExerciseTemplate[],
): Promise<void> {
  for (const exercise of exercises) {
    const name = normalizeExerciseName(exercise.name)
    if (!name) continue

    const entry: KnownExercise = {
      id: knownExerciseId(userId, name),
      userId,
      name,
      doubleStats: exercise.doubleStats || undefined,
    }
    await db.knownExercises.put(entry)
    mirrorKnownExerciseUpsert(entry)
  }
}

export async function getTemplates(userId: string): Promise<WorkoutTemplate[]> {
  return db.workoutTemplates
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('updatedAt')
}

export async function getTemplate(
  templateId: string,
): Promise<WorkoutTemplate | undefined> {
  return db.workoutTemplates.get(templateId)
}

export function isTemplateDraftValid(draft: WorkoutTemplateDraft): boolean {
  if (!draft.name.trim()) return false

  if (draft.type === 'cardio') {
    return (
      (draft.cardioDurationMinutes ?? 0) > 0 &&
      draft.cardioEquipment != null
    )
  }

  return draft.exercises.some(
    (exercise) =>
      exercise.name.trim() &&
      exercise.sets.some(
        (set) => set.weightKg > 0 || set.reps > 0,
      ),
  )
}

export async function saveTemplate(
  userId: string,
  draft: WorkoutTemplateDraft,
): Promise<WorkoutTemplate> {
  const now = new Date()
  const existing = draft.id ? await getTemplate(draft.id) : undefined

  const template: WorkoutTemplate = {
    id: draft.id ?? createId(),
    userId,
    name: draft.name.trim(),
    type: draft.type,
    cardioDurationMinutes:
      draft.type === 'cardio' ? Number(draft.cardioDurationMinutes) || 0 : null,
    cardioEquipment: draft.type === 'cardio' ? draft.cardioEquipment : null,
    exercises:
      draft.type === 'strength'
        ? draft.exercises.map((exercise) => ({
            ...exercise,
            name: normalizeExerciseName(exercise.name),
            doubleStats: exercise.doubleStats || undefined,
            sets: exercise.sets.map((set) => ({
              ...set,
              weightKg: Number(set.weightKg) || 0,
              reps: Number(set.reps) || 0,
            })),
          }))
        : [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await db.workoutTemplates.put(template)
  mirrorWorkoutTemplateUpsert(template)

  if (template.type === 'strength') {
    await registerExerciseNames(userId, template.exercises)
  }

  return template
}

export async function deleteTemplate(templateId: string): Promise<void> {
  await db.workoutTemplates.delete(templateId)
  mirrorWorkoutTemplateDelete(templateId)
}

export async function clearWorkoutTemplates(): Promise<void> {
  await db.workoutTemplates.clear()
}

export async function getKnownExercises(userId: string): Promise<KnownExercise[]> {
  const [known, historyRows] = await Promise.all([
    db.knownExercises.where('userId').equals(userId).toArray(),
    db.exerciseSetHistory.where('userId').equals(userId).toArray(),
  ])

  const map = new Map<string, KnownExercise>()

  for (const item of known) {
    map.set(exerciseKey(item.name), item)
  }

  for (const row of historyRows) {
    const name = normalizeExerciseName(row.exerciseName)
    if (!name) continue

    const key = exerciseKey(name)
    if (map.has(key)) continue

    map.set(key, {
      id: knownExerciseId(userId, name),
      userId,
      name,
    })
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function clearKnownExercises(): Promise<void> {
  await db.knownExercises.clear()
}

export type { CardioEquipment, WorkoutType }
