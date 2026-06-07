import { ArrowLeft, ListFilter, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { CardioEquipment, KnownExercise, WorkoutTemplate, WorkoutType } from '@/db'
import { useI18n } from '@/i18n/context'
import { formatTranslation, type TranslationKey } from '@/i18n/translations'
import { applyPresetToExercise, getLastExercisePreset } from '@/lib/exercise-presets'
import { CARDIO_EQUIPMENT } from '@/lib/workout-types'
import {
  createEmptyExercise,
  createEmptySet,
  createEmptyTemplateDraft,
  deleteTemplate,
  getKnownExercises,
  isTemplateDraftValid,
  saveTemplate,
  type WorkoutTemplateDraft,
} from '@/lib/workout-templates'
import { createId } from '@/lib/workout-utils'
import { cn } from '@/lib/utils'

interface WorkoutBuilderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  template?: WorkoutTemplate
  onSaved: () => void
  onDeleted?: () => void
}

export function WorkoutBuilderSheet({
  open,
  onOpenChange,
  userId,
  template,
  onSaved,
  onDeleted,
}: WorkoutBuilderSheetProps) {
  const { t } = useI18n()
  const [draft, setDraft] = useState<WorkoutTemplateDraft>(createEmptyTemplateDraft())
  const [saving, setSaving] = useState(false)
  const [knownExercises, setKnownExercises] = useState<KnownExercise[]>([])
  const [pickerExerciseId, setPickerExerciseId] = useState<string | null>(null)
  const [applyingPreset, setApplyingPreset] = useState(false)

  useEffect(() => {
    if (!open) return

    if (template) {
      setDraft({
        id: template.id,
        name: template.name,
        type: template.type,
        cardioDurationMinutes: template.cardioDurationMinutes,
        cardioEquipment: template.cardioEquipment,
        exercises: template.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) => ({ ...set })),
        })),
      })
    } else {
      setDraft(createEmptyTemplateDraft())
    }

    setPickerExerciseId(null)
    void getKnownExercises(userId).then(setKnownExercises)
  }, [open, template, userId])

  function setWorkoutType(type: WorkoutType) {
    if (type === 'cardio') {
      setDraft((current) => ({
        ...current,
        type,
        exercises: [],
        cardioDurationMinutes: current.cardioDurationMinutes ?? 30,
        cardioEquipment: current.cardioEquipment ?? 'bike',
      }))
    } else {
      setDraft((current) => ({
        ...current,
        type,
        cardioDurationMinutes: null,
        cardioEquipment: null,
      }))
    }
  }

  async function handleSave() {
    if (!isTemplateDraftValid(draft)) return

    setSaving(true)
    try {
      await saveTemplate(userId, draft)
      onSaved()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!template?.id) return
    await deleteTemplate(template.id)
    onDeleted?.()
    onOpenChange(false)
  }

  function updateExercise(
    exerciseId: string,
    updates: Partial<WorkoutTemplateDraft['exercises'][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise,
      ),
    }))
  }

  function updateSet(
    exerciseId: string,
    setId: string,
    updates: Partial<WorkoutTemplateDraft['exercises'][number]['sets'][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, ...updates } : set,
              ),
            }
          : exercise,
      ),
    }))
  }

  async function applyKnownExercise(targetExerciseId: string, exerciseName: string) {
    setApplyingPreset(true)
    try {
      const preset = await getLastExercisePreset(userId, exerciseName)
      const known = knownExercises.find((item) => item.name === exerciseName)

      setDraft((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) => {
          if (exercise.id !== targetExerciseId) return exercise

          const merged = applyPresetToExercise(exercise, preset, exerciseName)
          if (!preset && known?.doubleStats) {
            return { ...merged, doubleStats: true }
          }
          return merged
        }),
      }))
      setPickerExerciseId(null)
    } finally {
      setApplyingPreset(false)
    }
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92svh] flex-col rounded-t-2xl p-0"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-border/80 px-4 py-4 text-left">
          <SheetTitle>
            {template ? t('workouts.editWorkout') : t('workouts.newWorkout')}
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div className="space-y-1.5">
            <Label>{t('workouts.workoutName')}</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder={t('workouts.workoutName')}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('workouts.type')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['strength', 'cardio'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkoutType(type)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                    draft.type === type
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border/60 bg-input/30 text-muted-foreground',
                  )}
                >
                  {type === 'strength'
                    ? t('workouts.typeStrength')
                    : t('workouts.typeCardio')}
                </button>
              ))}
            </div>
          </div>

          {draft.type === 'cardio' ? (
            <div className="sport-card space-y-4 p-4">
              <div className="space-y-1.5">
                <Label>{t('workouts.duration')}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={draft.cardioDurationMinutes ?? ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      cardioDurationMinutes: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('workouts.cardioEquipment')}</Label>
                <NativeSelect
                  value={draft.cardioEquipment ?? 'bike'}
                  options={CARDIO_EQUIPMENT.map((equipment) => ({
                    value: equipment,
                    label: t(`workouts.equipment.${equipment}` as TranslationKey),
                  }))}
                  onValueChange={(value) =>
                    setDraft({
                      ...draft,
                      cardioEquipment: value as CardioEquipment,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <>
              {draft.exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="sport-card space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Label>
                      {t('workouts.exerciseName')} {exerciseIndex + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-destructive"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          exercises: current.exercises.filter(
                            (item) => item.id !== exercise.id,
                          ),
                        }))
                      }
                      aria-label={t('workouts.removeExercise')}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      className="min-w-0 flex-1"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(exercise.id, { name: e.target.value })
                      }
                      placeholder={t('workouts.exerciseName')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        'shrink-0 text-xs font-bold tracking-tight',
                        exercise.doubleStats
                          ? 'border-primary bg-primary/15 text-primary shadow-[0_0_16px_-4px_var(--primary)]'
                          : 'text-muted-foreground',
                      )}
                      aria-label={t('workouts.doubleStats')}
                      aria-pressed={Boolean(exercise.doubleStats)}
                      title={t('workouts.doubleStatsHint')}
                      onClick={() =>
                        updateExercise(exercise.id, {
                          doubleStats: !exercise.doubleStats,
                        })
                      }
                    >
                      x2
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="shrink-0"
                      disabled={knownExercises.length === 0 || applyingPreset}
                      onClick={() => setPickerExerciseId(exercise.id)}
                      aria-label={t('workouts.selectExercise')}
                    >
                      <ListFilter className="size-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="flex items-end gap-2">
                        <div className="grid flex-1 grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              {t('workouts.set')} {setIndex + 1} · {t('workouts.weight')}
                            </Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              value={set.weightKg || ''}
                              onChange={(e) =>
                                updateSet(exercise.id, set.id, {
                                  weightKg: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              {t('workouts.reps')}
                            </Label>
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              value={set.reps || ''}
                              onChange={(e) =>
                                updateSet(exercise.id, set.id, {
                                  reps: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                        {exercise.sets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-destructive"
                            onClick={() =>
                              updateExercise(exercise.id, {
                                sets: exercise.sets.filter(
                                  (item) => item.id !== set.id,
                                ),
                              })
                            }
                            aria-label={t('workouts.removeSet')}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      updateExercise(exercise.id, {
                        sets: [
                          ...exercise.sets,
                          { ...createEmptySet(), id: createId() },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" />
                    {t('workouts.addSet')}
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    exercises: [
                      ...current.exercises,
                      { ...createEmptyExercise(), id: createId() },
                    ],
                  }))
                }
              >
                <Plus className="size-4" />
                {t('workouts.addExercise')}
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            onClick={() => void handleSave()}
            disabled={saving || !isTemplateDraftValid(draft)}
          >
            {t('workouts.save')}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('workouts.cancel')}
          </Button>
          {template && (
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => void handleDelete()}
            >
              {t('workouts.delete')}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>

    <Sheet
      open={pickerExerciseId !== null}
      onOpenChange={(pickerOpen) => {
        if (!pickerOpen) setPickerExerciseId(null)
      }}
    >
      <SheetContent
        side="bottom"
        className="z-[60] flex max-h-[85svh] flex-col gap-4 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="text-left p-0">
          <SheetTitle>{t('workouts.selectExercise')}</SheetTitle>
        </SheetHeader>

        {knownExercises.length === 0 ? (
          <p className="px-1 py-4 text-sm text-muted-foreground">
            {t('workouts.exerciseHistoryEmpty')}
          </p>
        ) : (
          <ul className="min-h-0 flex-1 overflow-y-auto py-1">
            {knownExercises.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full rounded-lg px-2 py-3 text-left text-sm transition-colors hover:bg-primary/10 active:bg-primary/15"
                  disabled={applyingPreset || pickerExerciseId === null}
                  onClick={() => {
                    if (pickerExerciseId === null) return
                    void applyKnownExercise(pickerExerciseId, item.name)
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
    </>
  )
}

interface WorkoutOverlayHeaderProps {
  title: string
  onBack: () => void
}

export function WorkoutOverlayHeader({ title, onBack }: WorkoutOverlayHeaderProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-2 border-b border-border/80 pb-3">
      <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label={t('workouts.back')}>
        <ArrowLeft className="size-5" />
      </Button>
      <h2 className="min-w-0 flex-1 truncate text-lg font-bold">{title}</h2>
    </div>
  )
}

export function countTemplateSets(
  template: { exercises: { sets: unknown[] }[] },
): number {
  return template.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
}

export function templateSummary(
  template: Pick<
    WorkoutTemplate,
    'type' | 'exercises' | 'cardioDurationMinutes' | 'cardioEquipment'
  >,
  t: (
    key:
      | 'workouts.exercisesCount'
      | 'workouts.setsCount'
      | 'workouts.typeStrength'
      | 'workouts.typeCardio'
      | 'workouts.minutes'
      | `workouts.equipment.${CardioEquipment}`,
  ) => string,
): string {
  if (template.type === 'cardio' && template.cardioEquipment) {
    return `${t('workouts.typeCardio')} · ${template.cardioDurationMinutes} ${t('workouts.minutes')} · ${t(`workouts.equipment.${template.cardioEquipment}`)}`
  }

  const exercises = formatTranslation(t('workouts.exercisesCount'), {
    count: template.exercises.length,
  })
  const sets = formatTranslation(t('workouts.setsCount'), {
    count: countTemplateSets(template),
  })
  return `${t('workouts.typeStrength')} · ${exercises} · ${sets}`
}
