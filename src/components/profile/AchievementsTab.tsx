import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { UserAchievement } from '@/db'
import { useI18n } from '@/i18n/context'
import { formatTranslation } from '@/i18n/translations'
import {
  ACHIEVEMENT_CATALOG,
  checkAchievements,
  getUserAchievements,
} from '@/lib/achievements'
import { cn } from '@/lib/utils'

interface AchievementsTabProps {
  userId: string
}

export function AchievementsTab({ userId }: AchievementsTabProps) {
  const { t, language } = useI18n()
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    checkAchievements(userId)
      .then(() => getUserAchievements(userId))
      .then(setUnlocked)
      .finally(() => setLoading(false))
  }, [userId])

  const unlockedMap = new Map(unlocked.map((row) => [row.achievementId, row]))

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="px-1">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          {t('achievements.title')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENT_CATALOG.map((achievement) => {
          const row = unlockedMap.get(achievement.id)
          const Icon = achievement.icon

          return (
            <div
              key={achievement.id}
              className={cn(
                'sport-card flex flex-col gap-3 p-4',
                !row && 'opacity-60',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    row ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                {!row && <Lock className="size-4 shrink-0 text-muted-foreground" />}
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold leading-snug">
                  {t(achievement.titleKey)}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(achievement.descriptionKey)}
                </p>
                {row ? (
                  <p className="pt-1 text-[11px] text-primary/80">
                    {formatTranslation(t('achievements.unlockedAt'), {
                      date: new Intl.DateTimeFormat(
                        language === 'ru' ? 'ru-RU' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric' },
                      ).format(row.unlockedAt),
                    })}
                  </p>
                ) : (
                  <p className="pt-1 text-[11px] text-muted-foreground">
                    {t('achievements.locked')}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
