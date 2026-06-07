import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

import { WorkoutOverlayHeader } from '@/components/workouts/WorkoutBuilderSheet'
import type { WorkoutHistoryEntry } from '@/db'
import { useI18n } from '@/i18n/context'
import {
  getWorkoutHistoryDetail,
  type WorkoutHistoryExerciseGroup,
} from '@/lib/workout-sessions'

interface WorkoutHistoryDetailViewProps {
  userId: string
  historyId: string
  onBack: () => void
}

export function WorkoutHistoryDetailView({
  userId,
  historyId,
  onBack,
}: WorkoutHistoryDetailViewProps) {
  const { t, language } = useI18n()
  const [entry, setEntry] = useState<WorkoutHistoryEntry | null>(null)
  const [exercises, setExercises] = useState<WorkoutHistoryExerciseGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getWorkoutHistoryDetail(userId, historyId)
      .then((detail) => {
        setEntry(detail?.entry ?? null)
        setExercises(detail?.exercises ?? [])
      })
      .finally(() => setLoading(false))
  }, [userId, historyId])

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  if (!entry) {
    return (
      <div className="space-y-4">
        <WorkoutOverlayHeader title={t('workouts.tabHistory')} onBack={onBack} />
        <div className="sport-card p-6 text-center text-muted-foreground">
          {t('workouts.workoutHistoryEmpty')}
        </div>
      </div>
    )
  }

  const locale = language === 'ru' ? 'ru-RU' : 'en-US'
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(entry.completedAt)

  return (
    <div className="space-y-4">
      <WorkoutOverlayHeader title={entry.templateName} onBack={onBack} />

      <div className="sport-card-accent p-4">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          {entry.workoutType === 'cardio'
            ? t('workouts.typeCardio')
            : t('workouts.typeStrength')}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{dateLabel}</p>
        {entry.workoutType === 'cardio' ? (
          <p className="mt-2 text-lg font-bold text-primary">
            {entry.cardioDurationMinutes} {t('workouts.minutes')}
            {entry.cardioEquipment &&
              ` · ${t(`workouts.equipment.${entry.cardioEquipment}`)}`}
          </p>
        ) : (
          <p className="mt-2 text-lg font-bold text-primary">
            {t('workouts.totalVolume')}: {entry.totalVolumeKg} {t('profile.weightUnit')}
          </p>
        )}
      </div>

      {entry.note && (
        <div className="sport-card p-4">
          <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t('workouts.historyNote')}
          </p>
          <p className="whitespace-pre-wrap text-sm text-foreground">{entry.note}</p>
        </div>
      )}

      {entry.workoutType === 'strength' && (
        <div className="space-y-3">
          {exercises.length === 0 ? (
            <div className="sport-card p-6 text-center text-sm text-muted-foreground">
              {t('workouts.historyDetailEmpty')}
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <div key={`${exercise.name}-${index}`} className="sport-card p-4">
                <p className="mb-3 font-medium">
                  {index + 1}. {exercise.name}
                </p>
                <ul className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <li
                      key={setIndex}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-input/30 px-3 py-2.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {t('workouts.set')} {setIndex + 1}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-primary">
                        {set.toFailure && (
                          <Flame
                            className="flame-indicator size-4 shrink-0 text-primary"
                            aria-label={t('workouts.toFailure')}
                          />
                        )}
                        {set.weightKg} {t('profile.weightUnit')} × {set.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
