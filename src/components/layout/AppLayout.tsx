import { type ReactNode, useState } from 'react'

import { AppSidebar, type AppPage } from '@/components/layout/AppSidebar'
import { PageContent, PageHeader } from '@/components/layout/PageHeader'
import { PageHeaderProvider } from '@/components/layout/PageHeaderContext'
import { useI18n } from '@/i18n/context'
import type { User } from '@/db'

interface AppLayoutProps {
  user: User
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  onSignOut: () => void
  children: ReactNode
}

const pageTitleKeys = {
  profile: 'profile.title',
  workouts: 'workouts.title',
  settings: 'settings.title',
  console: 'console.title',
} as const

export function AppLayout({
  user,
  currentPage,
  onNavigate,
  onSignOut,
  children,
}: AppLayoutProps) {
  const { t } = useI18n()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <PageHeaderProvider>
      <div className="mx-auto flex h-svh w-full max-w-lg flex-col overflow-hidden border-x border-border/50 bg-background/95 shadow-[0_0_60px_-20px_var(--primary)]">
        <PageHeader
          title={t(pageTitleKeys[currentPage])}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <PageContent>{children}</PageContent>

        <AppSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          currentPage={currentPage}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
          userName={user.name}
          userEmail={user.email}
          userPicture={user.picture}
        />
      </div>
    </PageHeaderProvider>
  )
}
