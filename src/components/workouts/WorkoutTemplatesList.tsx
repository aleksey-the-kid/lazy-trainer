import { ChevronRight, Play } from 'lucide-react'

import { templateSummary } from '@/components/workouts/WorkoutBuilderSheet'
import type { WorkoutSession, WorkoutTemplate } from '@/db'
import { useI18n } from '@/i18n/context'
import { workoutTemplateImage } from '@/lib/ui-images'

interface WorkoutTemplatesListProps {
  templates: WorkoutTemplate[]
  activeSession: WorkoutSession | null
  onSelectTemplate: (templateId: string) => void
  onContinueActive: () => void
}

export function WorkoutTemplatesList({
  templates,
  activeSession,
  onSelectTemplate,
  onContinueActive,
}: WorkoutTemplatesListProps) {
  const { t } = useI18n()

  if (!activeSession && templates.length === 0) {
    return (
      <div className="sport-card flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="max-w-xs text-muted-foreground">{t('workouts.empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activeSession && (
        <button
          type="button"
          onClick={onContinueActive}
          className="sport-card-accent flex w-full items-center gap-3 p-4 text-left transition-transform active:scale-[0.99]"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_oklch(0.68_0.19_45_/_0.5)]">
            <Play className="size-5 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              {t('workouts.active')}
            </p>
            <p className="truncate text-base font-bold">{activeSession.templateName}</p>
          </div>
          <span className="text-sm font-semibold text-primary">{t('workouts.continue')}</span>
        </button>
      )}

      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelectTemplate(template.id)}
          className="sport-card-hero group relative flex h-36 w-full overflow-hidden text-left transition-transform active:scale-[0.99]"
        >
          <img
            src={workoutTemplateImage(template.id, template.type)}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-white">{template.name}</p>
              <p className="mt-0.5 text-sm text-white/80">{templateSummary(template, t)}</p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-white/90" />
          </div>
        </button>
      ))}
    </div>
  )
}
