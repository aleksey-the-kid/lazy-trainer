import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { ExerciseCharts } from '@/components/workouts/ExerciseCharts'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ExerciseSetHistory, KnownExercise } from '@/db'
import { useI18n } from '@/i18n/context'
import {
  aggregateExerciseHistoryByDay,
  calculateSetHistoryVolume,
  groupHistoryByDate,
} from '@/lib/exercise-chart-data'
import { getExerciseSetHistory } from '@/lib/workout-sessions'
import { getKnownExercises } from '@/lib/workout-templates'
import { cn } from '@/lib/utils'

interface ExerciseHistoryTabProps {
  userId: string
}

export function ExerciseHistoryTab({ userId }: ExerciseHistoryTabProps) {
  const { t, language } = useI18n()
  const [exercises, setExercises] = useState<KnownExercise[]>([])
  const [selected, setSelected] = useState<string>('')
  const [history, setHistory] = useState<ExerciseSetHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  const selectedExercise = exercises.find((exercise) => exercise.name === selected)
  const summaries = useMemo(
    () => aggregateExerciseHistoryByDay(history, selectedExercise?.doubleStats),
    [history, selectedExercise?.doubleStats],
  )
  const dayGroups = useMemo(() => {
    const groups = groupHistoryByDate(history)
    return [...groups].reverse()
  }, [history])

  useEffect(() => {
    getKnownExercises(userId)
      .then((items) => {
        setExercises(items)
        if (items.length > 0) {
          setSelected(items[0].name)
        }
      })
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!selected) {
      setHistory([])
      return
    }

    getExerciseSetHistory(userId, selected).then(setHistory)
  }, [userId, selected])

  useEffect(() => {
    const groups = groupHistoryByDate(history)
    const latestDate = groups.at(-1)?.date
    setExpandedDates(latestDate ? new Set([latestDate]) : new Set())
  }, [selected, history])

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="sport-card flex min-h-48 items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">{t('workouts.exerciseHistoryEmpty')}</p>
      </div>
    )
  }

  const locale = language === 'ru' ? 'ru-RU' : 'en-US'
  const weightUnit = t('profile.weightUnit')
  const chartLabels = {
    prWeight: t('workouts.exercisePrWeight'),
    prVolume: t('workouts.exercisePrVolume'),
    sessions: t('workouts.exerciseSessions'),
    chartWeight: t('workouts.exerciseChartWeight'),
    chartVolume: t('workouts.exerciseChartVolume'),
    chartReps: t('workouts.exerciseChartReps'),
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${date}T12:00:00`))
  }

  function formatDaySummary(sets: ExerciseSetHistory[]) {
    const maxWeight = Math.max(...sets.map((set) => set.weightKg))
    const setsLabel = t('workouts.setsCount').replace('{count}', String(sets.length))
    const maxLabel = t('workouts.exerciseDayMaxWeight')
      .replace('{weight}', String(maxWeight))
      .replace('{unit}', weightUnit)

    return `${setsLabel} · ${maxLabel}`
  }

  function toggleDate(date: string) {
    setExpandedDates((current) => {
      const next = new Set(current)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="sport-card space-y-1.5 p-4">
        <Label className="text-muted-foreground">{t('workouts.selectExercise')}</Label>
        <Select
          value={selected}
          onValueChange={(value) => value && setSelected(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.name}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {history.length === 0 ? (
        <div className="sport-card p-6 text-center text-muted-foreground">
          {t('workouts.exerciseHistoryEmpty')}
        </div>
      ) : (
        <>
          {summaries.length > 0 && (
            <ExerciseCharts
              summaries={summaries}
              language={language}
              weightUnit={weightUnit}
              labels={chartLabels}
            />
          )}

          <div className="sport-card overflow-hidden">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {t('workouts.exerciseHistoryList')}
              </p>
            </div>
            <ul className="divide-y divide-border/60">
              {dayGroups.map((group) => {
                const expanded = expandedDates.has(group.date)
                const dayVolume = calculateSetHistoryVolume(
                  group.sets,
                  selectedExercise?.doubleStats,
                )

                return (
                  <li key={group.date}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5 active:bg-primary/10"
                      onClick={() => toggleDate(group.date)}
                    >
                      <ChevronDown
                        className={cn(
                          'size-4 shrink-0 text-muted-foreground transition-transform',
                          !expanded && '-rotate-90',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{formatDate(group.date)}</p>
                        {!expanded && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {formatDaySummary(group.sets)}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          {t('workouts.totalVolume')}
                        </p>
                        <p className="font-bold text-primary">
                          {dayVolume} {weightUnit}
                        </p>
                      </div>
                    </button>

                    {expanded && (
                      <ul className="space-y-0 border-t border-border/40 bg-black/10">
                        {group.sets.map((entry, index) => (
                          <li
                            key={entry.id}
                            className="flex items-center justify-between px-4 py-2.5 pl-11"
                          >
                            <span className="text-sm text-muted-foreground">
                              {t('workouts.set')} {index + 1}
                            </span>
                            <span className="font-semibold text-primary">
                              {entry.weightKg} {weightUnit} × {entry.reps}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
