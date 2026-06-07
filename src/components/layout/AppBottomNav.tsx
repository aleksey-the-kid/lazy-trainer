import { Dumbbell, Settings, User } from 'lucide-react'

import type { AppPage } from '@/components/layout/app-page'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

interface AppBottomNavProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

const navItems: { page: AppPage; icon: typeof User; labelKey: 'nav.workouts' | 'nav.profile' | 'nav.settings' }[] = [
  { page: 'workouts', icon: Dumbbell, labelKey: 'nav.workouts' },
  { page: 'profile', icon: User, labelKey: 'nav.profile' },
  { page: 'settings', icon: Settings, labelKey: 'nav.settings' },
]

export function AppBottomNav({ currentPage, onNavigate }: AppBottomNavProps) {
  const { t } = useI18n()

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="glass-panel pointer-events-auto flex items-center gap-1 rounded-full p-1.5 shadow-[0_8px_32px_-8px_oklch(0.28_0.02_260_/_0.2)]">
        {navItems.map(({ page, icon: Icon, labelKey }) => {
          const active = currentPage === page

          return (
            <button
              key={page}
              type="button"
              onClick={() => onNavigate(page)}
              aria-label={t(labelKey)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex size-12 items-center justify-center rounded-full transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.68_0.19_45_/_0.6)]'
                  : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground',
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.25 : 2} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
