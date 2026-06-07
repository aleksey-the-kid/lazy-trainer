import { History, Ruler, User } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ProfileTab = 'overview' | 'history' | 'measurements'

interface ProfileTabBarProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  disabled?: boolean
  overviewLabel: string
  historyLabel: string
  measurementsLabel: string
}

export function ProfileTabBar({
  activeTab,
  onTabChange,
  disabled = false,
  overviewLabel,
  historyLabel,
  measurementsLabel,
}: ProfileTabBarProps) {
  const tabs: { id: ProfileTab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: overviewLabel, icon: User },
    { id: 'history', label: historyLabel, icon: History },
    { id: 'measurements', label: measurementsLabel, icon: Ruler },
  ]

  return (
    <nav className="-mx-4 shrink-0 border-t border-border/80 bg-card/95 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
      <div className="grid grid-cols-3 gap-2">
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
                'flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                tabDisabled && 'cursor-not-allowed opacity-40',
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.25 : 2} />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
