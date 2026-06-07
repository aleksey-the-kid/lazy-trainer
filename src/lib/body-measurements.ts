import type { BodyMeasurementEntry, BodyMeasurementField } from '@/db'
import { BODY_MEASUREMENT_FIELDS, db } from '@/db'
import { mirrorBodyMeasurementUpsert } from '@/lib/supabase/sync'

export type BodyMeasurementValues = Pick<
  BodyMeasurementEntry,
  BodyMeasurementField
>

export const MEASUREMENT_BASELINES: Record<BodyMeasurementField, number> = {
  neckCm: 38,
  shouldersCm: 110,
  chestCm: 100,
  waistCm: 80,
  hipsCm: 95,
  bicepCm: 32,
  forearmCm: 28,
  thighCm: 55,
  abdomenCm: 90,
}

export function emptyMeasurementValues(): BodyMeasurementValues {
  return {
    neckCm: null,
    shouldersCm: null,
    chestCm: null,
    waistCm: null,
    hipsCm: null,
    bicepCm: null,
    forearmCm: null,
    thighCm: null,
    abdomenCm: null,
  }
}

function todayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function entryId(userId: string, date: string): string {
  return `${userId}_measure_${date}`
}

export function hasAnyMeasurement(values: BodyMeasurementValues): boolean {
  return BODY_MEASUREMENT_FIELDS.some((field) => values[field] != null)
}

export async function saveBodyMeasurement(
  userId: string,
  date: string,
  values: BodyMeasurementValues,
): Promise<BodyMeasurementEntry> {
  const entry: BodyMeasurementEntry = {
    id: entryId(userId, date),
    userId,
    date,
    ...values,
  }

  await db.bodyMeasurements.put(entry)
  mirrorBodyMeasurementUpsert(entry)
  return entry
}

export async function getBodyMeasurementHistory(
  userId: string,
): Promise<BodyMeasurementEntry[]> {
  return db.bodyMeasurements.where('userId').equals(userId).sortBy('date')
}

export async function getLatestBodyMeasurement(
  userId: string,
): Promise<BodyMeasurementEntry | undefined> {
  const history = await getBodyMeasurementHistory(userId)
  return history.at(-1)
}

export function measurementScale(
  field: BodyMeasurementField,
  value: number | null | undefined,
): number {
  if (value == null || value <= 0) return 1
  const baseline = MEASUREMENT_BASELINES[field]
  return Math.min(1.45, Math.max(0.65, value / baseline))
}

export { todayDateString as measurementTodayDateString }
