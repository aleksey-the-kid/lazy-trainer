import { useEffect, useState } from 'react'

import { WeightChart } from '@/components/profile/WeightChart'
import type { WeightEntry } from '@/db'
import { useI18n } from '@/i18n/context'
import {
  getWeightHistory,
  syncWeightHistoryFromProfile,
} from '@/lib/weight-history'

interface ProfileHistoryTabProps {
  userId: string
  currentWeight: number | null
}

export function ProfileHistoryTab({
  userId,
  currentWeight,
}: ProfileHistoryTabProps) {
  const { t, language } = useI18n()
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    syncWeightHistoryFromProfile(userId, currentWeight)
      .then(() => getWeightHistory(userId))
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [userId, currentWeight])

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="sport-card flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-muted-foreground">{t('profile.historyEmpty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sport-card p-4">
        <p className="mb-3 text-xs font-medium tracking-widest text-primary uppercase">
          {t('profile.weightChart')}
        </p>
        <WeightChart entries={entries} />
      </div>

      <div className="sport-card overflow-hidden">
        <div className="border-b border-border/60 px-4 py-3">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t('profile.historyList')}
          </p>
        </div>
        <ul className="divide-y divide-border/60">
          {[...entries].reverse().map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(
                  language === 'ru' ? 'ru-RU' : 'en-US',
                  { day: 'numeric', month: 'long', year: 'numeric' },
                ).format(new Date(`${entry.date}T12:00:00`))}
              </span>
              <span className="font-semibold text-primary">
                {entry.weightKg}{' '}
                <span className="text-sm font-normal text-muted-foreground">
                  {t('profile.weightUnit')}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
