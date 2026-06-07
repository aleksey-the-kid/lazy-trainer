import { Dumbbell, History, List, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { ActiveWorkoutView } from '@/components/workouts/ActiveWorkoutView'
import { ExerciseHistoryTab } from '@/components/workouts/ExerciseHistoryTab'
import { WorkoutBuilderSheet } from '@/components/workouts/WorkoutBuilderSheet'
import { WorkoutDetailView } from '@/components/workouts/WorkoutDetailView'
import { WorkoutHistoryDetailView } from '@/components/workouts/WorkoutHistoryDetailView'
import { WorkoutHistoryTab } from '@/components/workouts/WorkoutHistoryTab'
import { WorkoutTemplatesList } from '@/components/workouts/WorkoutTemplatesList'
import { Button } from '@/components/ui/button'
import type { User, WorkoutSession, WorkoutTemplate } from '@/db'
import { useI18n } from '@/i18n/context'
import {
  getActiveSession,
  getSession,
  startWorkout,
} from '@/lib/workout-sessions'
import { getTemplate, getTemplates } from '@/lib/workout-templates'
import { cn } from '@/lib/utils'

export type WorkoutsTab = 'templates' | 'exercises' | 'history'

type WorkoutsOverlay =
  | { type: 'none' }
  | { type: 'detail'; templateId: string }
  | { type: 'active'; sessionId: string }
  | { type: 'historyDetail'; historyId: string }

interface WorkoutsPageProps {
  user: User
}

export function WorkoutsPage({ user }: WorkoutsPageProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<WorkoutsTab>('templates')
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null)
  const [overlay, setOverlay] = useState<WorkoutsOverlay>({ type: 'none' })
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(
    null,
  )
  const [activeViewSession, setActiveViewSession] = useState<WorkoutSession | null>(
    null,
  )
  const [builderOpen, setBuilderOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>()
  const [startError, setStartError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [loadedTemplates, session] = await Promise.all([
      getTemplates(user.id),
      getActiveSession(user.id),
    ])
    setTemplates(loadedTemplates)
    setActiveSession(session ?? null)
  }, [user.id])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  useEffect(() => {
    if (overlay.type !== 'detail') {
      setSelectedTemplate(null)
      return
    }

    getTemplate(overlay.templateId).then((template) =>
      setSelectedTemplate(template ?? null),
    )
  }, [overlay])

  useEffect(() => {
    if (overlay.type !== 'active') {
      setActiveViewSession(null)
      return
    }

    getSession(overlay.sessionId).then((session) =>
      setActiveViewSession(session ?? null),
    )
  }, [overlay])

  const showChrome = overlay.type === 'none'

  async function handleStartWorkout(template: WorkoutTemplate) {
    setStartError(null)
    try {
      const session = await startWorkout(user.id, template)
      setActiveSession(session)
      setOverlay({ type: 'active', sessionId: session.id })
    } catch {
      setStartError(t('workouts.activeSessionExists'))
    }
  }

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          'min-h-0 flex-1',
          overlay.type === 'active' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto pb-2',
        )}
      >
        {overlay.type === 'detail' && selectedTemplate && (
          <WorkoutDetailView
            template={selectedTemplate}
            onBack={() => setOverlay({ type: 'none' })}
            onEdit={() => {
              setEditingTemplate(selectedTemplate)
              setBuilderOpen(true)
            }}
            onStart={() => void handleStartWorkout(selectedTemplate)}
            startDisabled={!!activeSession}
            startError={startError}
          />
        )}

        {overlay.type === 'active' && activeViewSession && (
          <ActiveWorkoutView
            session={activeViewSession}
            onBack={() => setOverlay({ type: 'none' })}
            onSessionUpdate={setActiveViewSession}
            onCompleted={() => {
              setOverlay({ type: 'none' })
              void refresh()
            }}
          />
        )}

        {overlay.type === 'historyDetail' && (
          <WorkoutHistoryDetailView
            userId={user.id}
            historyId={overlay.historyId}
            onBack={() => setOverlay({ type: 'none' })}
          />
        )}

        {overlay.type === 'none' && (
          <>
            {activeTab === 'templates' && (
              <WorkoutTemplatesList
                templates={templates}
                activeSession={activeSession}
                onSelectTemplate={(templateId) =>
                  setOverlay({ type: 'detail', templateId })
                }
                onContinueActive={() => {
                  if (activeSession) {
                    setOverlay({ type: 'active', sessionId: activeSession.id })
                  }
                }}
              />
            )}
            {activeTab === 'exercises' && (
              <ExerciseHistoryTab userId={user.id} />
            )}
            {activeTab === 'history' && (
              <WorkoutHistoryTab
                userId={user.id}
                onSelectEntry={(historyId) =>
                  setOverlay({ type: 'historyDetail', historyId })
                }
              />
            )}
          </>
        )}
      </div>

      {showChrome && activeTab === 'templates' && (
        <Button
          size="icon-lg"
          className="absolute right-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 size-14 rounded-full shadow-[0_8px_24px_-4px_oklch(0.68_0.19_45_/_0.55)]"
          onClick={() => {
            setEditingTemplate(undefined)
            setBuilderOpen(true)
          }}
          aria-label={t('workouts.newWorkout')}
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </Button>
      )}

      {showChrome && (
        <BottomTabBar
          variant="pills"
          tabs={[
            { id: 'templates' as const, label: t('workouts.tabTemplates'), icon: List },
            {
              id: 'exercises' as const,
              label: t('workouts.tabExercises'),
              icon: Dumbbell,
            },
            {
              id: 'history' as const,
              label: t('workouts.tabHistory'),
              icon: History,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          columns={3}
        />
      )}

      <WorkoutBuilderSheet
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        userId={user.id}
        template={editingTemplate}
        onSaved={() => {
          void refresh()
          if (overlay.type === 'detail' && editingTemplate) {
            setOverlay({ type: 'detail', templateId: editingTemplate.id })
          }
        }}
        onDeleted={() => {
          setOverlay({ type: 'none' })
          void refresh()
        }}
      />
    </div>
  )
}
