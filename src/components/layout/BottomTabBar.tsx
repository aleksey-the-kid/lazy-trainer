import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface BottomTabItem<T extends string> {
  id: T
  label: string
  icon: LucideIcon
}

interface BottomTabBarProps<T extends string> {
  tabs: BottomTabItem<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  columns?: 2 | 3
}

export function BottomTabBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  columns = 2,
}: BottomTabBarProps<T>) {
  return (
    <nav className="-mx-4 shrink-0 border-t border-border/80 bg-card/95 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
      <div
        className={cn(
          'grid gap-2',
          columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
        )}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.25 : 2} />
              <span className="truncate px-1">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
