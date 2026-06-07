import { Check, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

import { WorkoutOverlayHeader } from '@/components/workouts/WorkoutBuilderSheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { WorkoutSession } from '@/db'
import { useI18n } from '@/i18n/context'
import {
  completeWorkout,
  toggleCardioComplete,
  toggleSetComplete,
  updateSessionExercises,
} from '@/lib/workout-sessions'
import { calculateSessionVolume } from '@/lib/workout-utils'
import { cn } from '@/lib/utils'

interface ActiveWorkoutViewProps {
  session: WorkoutSession
  onBack: () => void
  onCompleted: () => void
  onSessionUpdate: (session: WorkoutSession) => void
}

interface PendingFailureSet {
  exerciseId: string
  setId: string
  exerciseName: string
  setIndex: number
  weightKg: number
}

function collectPendingFailureSets(session: WorkoutSession): PendingFailureSet[] {
  const pending: PendingFailureSet[] = []

  for (const exercise of session.exercises) {
    exercise.sets.forEach((set, setIndex) => {
      if (
        set.completed &&
        set.toFailure &&
        (set.actualReps == null || set.actualReps <= 0)
      ) {
        pending.push({
          exerciseId: exercise.id,
          setId: set.id,
          exerciseName: exercise.name,
          setIndex,
          weightKg: set.weightKg,
        })
      }
    })
  }

  return pending
}

export function ActiveWorkoutView({
  session,
  onBack,
  onCompleted,
  onSessionUpdate,
}: ActiveWorkoutViewProps) {
  const { t } = useI18n()
  const [completing, setCompleting] = useState(false)
  const [failurePromptOpen, setFailurePromptOpen] = useState(false)
  const [notePromptOpen, setNotePromptOpen] = useState(false)
  const [failureReps, setFailureReps] = useState<Record<string, number>>({})
  const [workoutNote, setWorkoutNote] = useState('')

  const pendingFailureSets = collectPendingFailureSets(session)

  useEffect(() => {
    if (!failurePromptOpen) return

    const initial: Record<string, number> = {}
    for (const item of pendingFailureSets) {
      initial[item.setId] = failureReps[item.setId] ?? 0
    }
    setFailureReps(initial)
  }, [failurePromptOpen, session])

  function openNotePrompt() {
    setWorkoutNote('')
    setNotePromptOpen(true)
  }

  async function finishWorkout(note: string | null) {
    setCompleting(true)
    try {
      await completeWorkout(session.id, note)
      onCompleted()
    } finally {
      setCompleting(false)
      setFailurePromptOpen(false)
      setNotePromptOpen(false)
    }
  }

  function handleComplete() {
    if (pendingFailureSets.length > 0) {
      setFailurePromptOpen(true)
      return
    }

    openNotePrompt()
  }

  async function handleFailureRepsConfirm() {
    const missing = pendingFailureSets.some(
      (item) => (failureReps[item.setId] ?? 0) <= 0,
    )
    if (missing) return

    const exercises = session.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.toFailure && set.completed
          ? { ...set, actualReps: failureReps[set.id] ?? set.actualReps }
          : set,
      ),
    }))

    const updated = await updateSessionExercises(session.id, exercises)
    if (!updated) return

    onSessionUpdate(updated)
    setFailurePromptOpen(false)
    openNotePrompt()
  }

  const noteSheet = (
    <Sheet open={notePromptOpen} onOpenChange={setNotePromptOpen}>
      <SheetContent
        side="bottom"
        className="flex max-h-[85svh] flex-col gap-4 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        showCloseButton={false}
      >
        <SheetHeader className="text-left p-0">
          <SheetTitle>{t('workouts.noteTitle')}</SheetTitle>
        </SheetHeader>

        <textarea
          value={workoutNote}
          onChange={(event) => setWorkoutNote(event.target.value)}
          placeholder={t('workouts.notePlaceholder')}
          rows={8}
          className="box-border min-h-48 w-full min-w-0 flex-1 resize-none rounded-lg border border-border/80 bg-input px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />

        <Button
          className="w-full"
          disabled={completing}
          onClick={() => void finishWorkout(workoutNote.trim() || null)}
        >
          {completing ? t('common.loading') : t('workouts.noteSave')}
        </Button>
      </SheetContent>
    </Sheet>
  )

  const failureSheet = session.type === 'strength' ? (
    <Sheet open={failurePromptOpen} onOpenChange={setFailurePromptOpen}>
      <SheetContent
        side="bottom"
        className="flex max-h-[85svh] flex-col gap-4 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        showCloseButton={false}
      >
        <SheetHeader className="text-left p-0">
          <SheetTitle>{t('workouts.failureRepsTitle')}</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-2">
          {pendingFailureSets.map((item) => (
            <div key={item.setId} className="sport-card space-y-2 p-3">
              <p className="text-sm font-medium">
                {item.exerciseName} · {t('workouts.set')} {item.setIndex + 1}
              </p>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {t('workouts.failureRepsActual')}
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={failureReps[item.setId] || ''}
                  onChange={(e) =>
                    setFailureReps((current) => ({
                      ...current,
                      [item.setId]: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={
            completing ||
            pendingFailureSets.some((item) => (failureReps[item.setId] ?? 0) <= 0)
          }
          onClick={() => void handleFailureRepsConfirm()}
        >
          {t('workouts.failureRepsConfirm')}
        </Button>
      </SheetContent>
    </Sheet>
  ) : null

  if (session.type === 'cardio') {
    return (
      <>
        <div className="space-y-4">
          <WorkoutOverlayHeader title={session.templateName} onBack={onBack} />

          <div className="sport-card-accent p-4">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              {t('workouts.typeCardio')}
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {session.cardioDurationMinutes} {t('workouts.minutes')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.cardioEquipment &&
                t(`workouts.equipment.${session.cardioEquipment}`)}
            </p>
          </div>

          <label
            className={cn(
              'sport-card flex cursor-pointer items-center gap-3 p-4 transition-colors',
              session.cardioCompleted && 'border-primary/40 bg-primary/10',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded border',
                session.cardioCompleted
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background',
              )}
            >
              {session.cardioCompleted && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={session.cardioCompleted}
              onChange={(e) =>
                void toggleCardioComplete(session.id, e.target.checked).then(
                  (updated) => updated && onSessionUpdate(updated),
                )
              }
            />
            <span className="font-medium">{t('workouts.cardioDone')}</span>
          </label>

          <Button
            className="w-full"
            onClick={handleComplete}
            disabled={completing}
          >
            {t('workouts.complete')}
          </Button>
        </div>

        {noteSheet}
      </>
    )
  }

  const completedSets = session.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  )
  const totalSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  )
  const currentVolume = calculateSessionVolume(session.exercises)

  async function handleToggle(
    exerciseId: string,
    setId: string,
    completed: boolean,
  ) {
    const updated = await toggleSetComplete(session.id, exerciseId, setId, completed)
    if (updated) onSessionUpdate(updated)
  }

  async function handleFailureToggle(
    exerciseId: string,
    setId: string,
    enabled: boolean,
  ) {
    const exercises = session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) return exercise

      return {
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId
            ? {
                ...set,
                toFailure: enabled,
                actualReps: enabled ? set.actualReps : undefined,
              }
            : set,
        ),
      }
    })

    const updated = await updateSessionExercises(session.id, exercises)
    if (updated) onSessionUpdate(updated)
  }

  async function handleActualRepsChange(
    exerciseId: string,
    setId: string,
    actualReps: number,
  ) {
    const exercises = session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) return exercise

      return {
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId ? { ...set, actualReps: actualReps || undefined } : set,
        ),
      }
    })

    const updated = await updateSessionExercises(session.id, exercises)
    if (updated) onSessionUpdate(updated)
  }

  function formatSetLabel(
    set: WorkoutSession['exercises'][number]['sets'][number],
  ) {
    const reps =
      set.toFailure && set.actualReps != null && set.actualReps > 0
        ? set.actualReps
        : set.reps

    return `${set.weightKg} ${t('profile.weightUnit')} × ${reps}`
  }

  return (
    <>
      <div className="space-y-4">
        <WorkoutOverlayHeader title={session.templateName} onBack={onBack} />

        <div className="sport-card-accent p-4">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            {t('workouts.active')}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {completedSets}/{totalSets} · {t('workouts.totalVolume')}: {currentVolume}{' '}
            {t('profile.weightUnit')}
          </p>
        </div>

        <div className="space-y-3">
          {session.exercises.map((exercise, index) => (
            <div key={exercise.id} className="sport-card p-4">
              <p className="mb-3 font-medium">
                {index + 1}. {exercise.name}
              </p>
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          'min-w-0 flex-1 rounded-lg border transition-colors',
                          set.completed
                            ? 'border-primary/40 bg-primary/10'
                            : 'border-border/60 bg-input/30',
                        )}
                      >
                        <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5">
                          <span
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center rounded border',
                              set.completed
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background',
                            )}
                          >
                            {set.completed && (
                              <Check className="size-3.5" strokeWidth={3} />
                            )}
                          </span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={set.completed}
                            onChange={(e) =>
                              void handleToggle(exercise.id, set.id, e.target.checked)
                            }
                          />
                          <span className="flex-1 text-sm">
                            {t('workouts.set')} {setIndex + 1}
                          </span>
                          {set.toFailure && set.completed && (
                            <Flame
                              className="flame-indicator size-4 shrink-0 text-primary"
                              aria-label={t('workouts.toFailure')}
                            />
                          )}
                          <span className="text-sm font-medium text-primary">
                            {formatSetLabel(set)}
                          </span>
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className={cn(
                          'shrink-0',
                          set.toFailure
                            ? 'border-primary bg-primary/15 text-primary shadow-[0_0_16px_-4px_var(--primary)]'
                            : 'text-muted-foreground',
                        )}
                        aria-label={t('workouts.toFailure')}
                        aria-pressed={Boolean(set.toFailure)}
                        title={t('workouts.toFailureHint')}
                        onClick={() =>
                          void handleFailureToggle(
                            exercise.id,
                            set.id,
                            !set.toFailure,
                          )
                        }
                      >
                        <Flame className="size-4" />
                      </Button>
                    </div>
                    {set.toFailure && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          {t('workouts.failureRepsActual')}
                        </Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={set.actualReps || ''}
                          onChange={(e) =>
                            void handleActualRepsChange(
                              exercise.id,
                              set.id,
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={handleComplete}
          disabled={completing}
        >
          {t('workouts.complete')}
        </Button>
      </div>

      {failureSheet}
      {noteSheet}
    </>
  )
}
