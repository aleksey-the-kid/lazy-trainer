import { Play, Pencil } from 'lucide-react'

import {
  templateSummary,
  WorkoutOverlayHeader,
} from '@/components/workouts/WorkoutBuilderSheet'
import { Button } from '@/components/ui/button'
import type { WorkoutTemplate } from '@/db'
import { useI18n } from '@/i18n/context'

interface WorkoutDetailViewProps {
  template: WorkoutTemplate
  onBack: () => void
  onEdit: () => void
  onStart: () => void
  startDisabled?: boolean
  startError?: string | null
}

export function WorkoutDetailView({
  template,
  onBack,
  onEdit,
  onStart,
  startDisabled,
  startError,
}: WorkoutDetailViewProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <WorkoutOverlayHeader title={template.name} onBack={onBack} />

      <p className="text-sm text-muted-foreground">{templateSummary(template, t)}</p>

      {template.type === 'cardio' ? (
        <div className="sport-card space-y-3 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('workouts.duration')}</span>
            <span className="font-medium">
              {template.cardioDurationMinutes} {t('workouts.minutes')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('workouts.cardioEquipment')}</span>
            <span className="font-medium">
              {template.cardioEquipment &&
                t(`workouts.equipment.${template.cardioEquipment}`)}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {template.exercises.map((exercise, index) => (
            <div key={exercise.id} className="sport-card p-4">
              <p className="font-medium">
                {index + 1}. {exercise.name}
              </p>
              <ul className="mt-2 space-y-1.5">
                {exercise.sets.map((set, setIndex) => (
                  <li
                    key={set.id}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>
                      {t('workouts.set')} {setIndex + 1}
                    </span>
                    <span>
                      {set.weightKg} {t('profile.weightUnit')} × {set.reps}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={onStart} disabled={startDisabled}>
          <Play className="size-4" />
          {t('workouts.start')}
        </Button>
        {startError && <p className="text-sm text-destructive">{startError}</p>}
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="size-4" />
          {t('workouts.edit')}
        </Button>
      </div>
    </div>
  )
}
