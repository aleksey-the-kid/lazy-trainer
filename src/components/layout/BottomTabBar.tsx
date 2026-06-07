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
  variant?: 'grid' | 'pills'
  columns?: 2 | 3
}

export function BottomTabBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
  columns = 2,
}: BottomTabBarProps<T>) {
  if (variant === 'pills') {
    return (
      <nav className="-mx-4 shrink-0 px-4 py-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id

            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={cn(
                  'filter-chip flex items-center gap-2',
                  active ? 'filter-chip-active' : 'filter-chip-inactive',
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

  return (
    <nav className="-mx-4 shrink-0 glass-panel mx-0 rounded-none border-x-0 border-b-0 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
                'flex flex-col items-center gap-1 rounded-2xl py-2.5 text-xs font-medium transition-colors',
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
