import { useEffect, useState, type ReactNode } from 'react'

import { UpdateToast } from '@/components/app/UpdateToast'
import { useI18n } from '@/i18n/context'
import { formatTranslation } from '@/i18n/translations'
import {
  ACHIEVEMENT_CATALOG,
  subscribeAchievementUnlocks,
  type AchievementId,
} from '@/lib/achievements'

interface AchievementUnlockProviderProps {
  children: ReactNode
}

export function AchievementUnlockProvider({ children }: AchievementUnlockProviderProps) {
  const { t } = useI18n()
  const [queue, setQueue] = useState<AchievementId[]>([])

  useEffect(() => {
    return subscribeAchievementUnlocks((ids) => {
      setQueue((current) => [...current, ...ids])
    })
  }, [])

  const currentId = queue[0]
  const current = ACHIEVEMENT_CATALOG.find((item) => item.id === currentId)

  function dismissCurrent() {
    setQueue((current) => current.slice(1))
  }

  return (
    <>
      {children}
      {current && (
        <UpdateToast
          message={formatTranslation(t('achievements.unlockedToast'), {
            title: t(current.titleKey),
          })}
          onClick={dismissCurrent}
        />
      )}
    </>
  )
}
