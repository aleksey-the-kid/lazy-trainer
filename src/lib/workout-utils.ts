export function createId(): string {
  return crypto.randomUUID()
}

const EXERCISE_WORD_ALIASES: Record<string, string> = {
  разгибания: 'разгибание',
  сгибания: 'сгибание',
}

function canonicalWord(word: string): string {
  return EXERCISE_WORD_ALIASES[word] ?? word
}

function normalizeWords(name: string): string[] {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(canonicalWord)
}

/** Stable identity for matching exercises (case, plural forms). */
export function exerciseKey(name: string): string {
  return normalizeWords(name).join(' ')
}

/** Canonical label stored in DB and shown in UI. */
export function normalizeExerciseName(name: string): string {
  const words = normalizeWords(name)
  if (words.length === 0) return ''

  const joined = words.join(' ')
  return joined.charAt(0).toUpperCase() + joined.slice(1)
}

export function knownExerciseId(userId: string, name: string): string {
  return `${userId}_${exerciseKey(name)}`
}

/** @deprecated Use normalizeExerciseName or exerciseKey. */
export function exerciseId(name: string): string {
  return normalizeExerciseName(name)
}

export interface EffectiveSetInput {
  reps: number
  toFailure?: boolean
  actualReps?: number
}

export function getEffectiveReps(
  set: EffectiveSetInput,
  doubleStats?: boolean,
): number {
  const base =
    set.toFailure && set.actualReps != null && set.actualReps > 0
      ? set.actualReps
      : set.reps
  return doubleStats ? base * 2 : base
}

export function calculateSessionVolume(
  exercises: {
    doubleStats?: boolean
    sets: {
      weightKg: number
      reps: number
      completed: boolean
      toFailure?: boolean
      actualReps?: number
    }[]
  }[],
): number {
  return exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (setTotal, set) =>
          set.completed
            ? setTotal +
              set.weightKg * getEffectiveReps(set, exercise.doubleStats)
            : setTotal,
        0,
      ),
    0,
  )
}

export function todayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
