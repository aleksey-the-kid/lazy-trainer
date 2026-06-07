import type { CardioEquipment, WorkoutTemplate } from '@/db'

export const CARDIO_EQUIPMENT: CardioEquipment[] = [
  'bike',
  'treadmill',
  'elliptical',
]

export function isStrengthTemplate(
  template: Pick<WorkoutTemplate, 'type'>,
): boolean {
  return template.type === 'strength'
}

export function isCardioTemplate(
  template: Pick<WorkoutTemplate, 'type'>,
): boolean {
  return template.type === 'cardio'
}

export function formatDuration(minutes: number): string {
  return `${minutes}`
}
