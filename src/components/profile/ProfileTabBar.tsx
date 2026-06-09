import { History, Ruler, Trophy, User } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ProfileTab = 'overview' | 'history' | 'measurements' | 'achievements'

interface ProfileTabBarProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  disabled?: boolean
  overviewLabel: string
  historyLabel: string
  measurementsLabel: string
  achievementsLabel: string
}

export function ProfileTabBar({
  activeTab,
  onTabChange,
  disabled = false,
  overviewLabel,
  historyLabel,
  measurementsLabel,
  achievementsLabel,
}: ProfileTabBarProps) {
  const tabs: { id: ProfileTab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: overviewLabel, icon: User },
    { id: 'history', label: historyLabel, icon: History },
    { id: 'measurements', label: measurementsLabel, icon: Ruler },
    { id: 'achievements', label: achievementsLabel, icon: Trophy },
  ]

  return (
    <nav className="-mx-4 shrink-0 px-4 py-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          const tabDisabled = disabled && id !== 'overview'

          return (
            <button
              key={id}
              type="button"
              disabled={tabDisabled}
              onClick={() => onTabChange(id)}
              className={cn(
                'filter-chip flex items-center gap-2',
                active ? 'filter-chip-active' : 'filter-chip-inactive',
                tabDisabled && 'cursor-not-allowed opacity-40',
              )}
            >
              <Icon className="size-4" strokeWidth={active ? 2.25 : 2} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
