import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { WorkoutHistoryEntry } from '@/db'
import { useI18n } from '@/i18n/context'
import { getWorkoutHistory } from '@/lib/workout-sessions'
import { cn } from '@/lib/utils'

interface WorkoutHistoryTabProps {
  userId: string
  onSelectEntry: (historyId: string) => void
}

export function WorkoutHistoryTab({ userId, onSelectEntry }: WorkoutHistoryTabProps) {
  const { t, language } = useI18n()
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWorkoutHistory(userId)
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  if (history.length === 0) {
    return (
      <div className="sport-card flex min-h-48 items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">{t('workouts.workoutHistoryEmpty')}</p>
      </div>
    )
  }

  const locale = language === 'ru' ? 'ru-RU' : 'en-US'

  return (
    <div className="sport-card overflow-hidden">
      <ul className="divide-y divide-border/60">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className={cn(
                'flex w-full items-start gap-3 px-4 py-4 text-left transition-colors',
                'hover:bg-primary/5 active:bg-primary/10',
              )}
              onClick={() => onSelectEntry(entry.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{entry.templateName}</p>
                <p className="mt-0.5 text-xs text-primary">
                  {entry.workoutType === 'cardio'
                    ? t('workouts.typeCardio')
                    : t('workouts.typeStrength')}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(entry.completedAt)}
                </p>
                {entry.note && (
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{entry.note}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="text-right">
                  {entry.workoutType === 'cardio' ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {t('workouts.duration')}
                      </p>
                      <p className="font-bold text-primary">
                        {entry.cardioDurationMinutes} {t('workouts.minutes')}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {entry.cardioEquipment &&
                          t(`workouts.equipment.${entry.cardioEquipment}`)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {t('workouts.totalVolume')}
                      </p>
                      <p className="font-bold text-primary">
                        {entry.totalVolumeKg} {t('profile.weightUnit')}
                      </p>
                    </>
                  )}
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
