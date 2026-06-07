import type { ExerciseSetHistory } from '@/db'
import { getEffectiveReps } from '@/lib/workout-utils'

export interface ExerciseDaySummary {
  date: string
  maxWeight: number
  repsAtMaxWeight: number
  maxReps: number
  totalVolume: number
  setCount: number
}

export interface ExerciseDayGroup {
  date: string
  sets: ExerciseSetHistory[]
}

export function groupHistoryByDate(history: ExerciseSetHistory[]): ExerciseDayGroup[] {
  const groups: ExerciseDayGroup[] = []
  const indexByDate = new Map<string, number>()

  for (const entry of history) {
    const groupIndex = indexByDate.get(entry.date)
    if (groupIndex !== undefined) {
      groups[groupIndex].sets.push(entry)
    } else {
      indexByDate.set(entry.date, groups.length)
      groups.push({ date: entry.date, sets: [entry] })
    }
  }

  return groups
}

export function calculateSetHistoryVolume(
  sets: ExerciseSetHistory[],
  doubleStats?: boolean,
): number {
  return sets.reduce(
    (sum, set) =>
      sum + set.weightKg * getEffectiveReps({ reps: set.reps }, doubleStats),
    0,
  )
}

export function aggregateExerciseHistoryByDay(
  history: ExerciseSetHistory[],
  doubleStats?: boolean,
): ExerciseDaySummary[] {
  const byDate = new Map<string, ExerciseSetHistory[]>()

  for (const row of history) {
    const bucket = byDate.get(row.date)
    if (bucket) bucket.push(row)
    else byDate.set(row.date, [row])
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sets]) => {
      const maxWeight = Math.max(...sets.map((set) => set.weightKg))
      const atMaxWeight = sets.filter((set) => set.weightKg === maxWeight)
      const repsAtMaxWeight = Math.max(...atMaxWeight.map((set) => set.reps))
      const maxReps = Math.max(...sets.map((set) => set.reps))
      const totalVolume = sets.reduce(
        (sum, set) =>
          sum + set.weightKg * getEffectiveReps({ reps: set.reps }, doubleStats),
        0,
      )

      return {
        date,
        maxWeight,
        repsAtMaxWeight,
        maxReps,
        totalVolume,
        setCount: sets.length,
      }
    })
}

export function exercisePersonalRecords(summaries: ExerciseDaySummary[]) {
  if (summaries.length === 0) {
    return { maxWeight: 0, maxVolume: 0, sessionCount: 0 }
  }

  return {
    maxWeight: Math.max(...summaries.map((day) => day.maxWeight)),
    maxVolume: Math.max(...summaries.map((day) => day.totalVolume)),
    sessionCount: summaries.length,
  }
}
