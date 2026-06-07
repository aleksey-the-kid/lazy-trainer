import { ChevronRight, Play } from 'lucide-react'

import { templateSummary } from '@/components/workouts/WorkoutBuilderSheet'
import type { WorkoutSession, WorkoutTemplate } from '@/db'
import { useI18n } from '@/i18n/context'

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
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 py-8 text-center">
        <p className="max-w-xs text-muted-foreground">{t('workouts.empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activeSession && (
        <button
          type="button"
          onClick={onContinueActive}
          className="sport-card-accent flex w-full items-center gap-3 p-4 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <Play className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              {t('workouts.active')}
            </p>
            <p className="truncate font-semibold">{activeSession.templateName}</p>
          </div>
          <span className="text-sm font-medium text-primary">
            {t('workouts.continue')}
          </span>
        </button>
      )}

      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelectTemplate(template.id)}
          className="sport-card flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-card/80"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{template.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {templateSummary(template, t)}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}
