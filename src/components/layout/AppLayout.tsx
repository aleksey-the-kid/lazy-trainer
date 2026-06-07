import { type ReactNode } from 'react'

import { AppBottomNav } from '@/components/layout/AppBottomNav'
import type { AppPage } from '@/components/layout/app-page'
import { PageContent, PageHeader } from '@/components/layout/PageHeader'
import { PageHeaderProvider } from '@/components/layout/PageHeaderContext'
import { useI18n } from '@/i18n/context'
import type { User } from '@/db'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  user: User
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  children: ReactNode
}

export function AppLayout({
  user,
  currentPage,
  onNavigate,
  children,
}: AppLayoutProps) {
  const { t } = useI18n()
  const showBottomNav = currentPage !== 'console'

  return (
    <PageHeaderProvider>
      <div className="page-gradient relative mx-auto flex h-svh w-full max-w-lg flex-col overflow-hidden bg-background">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3">
          {showBottomNav && (
            <PageHeader
              userName={user.name}
              userPicture={user.picture}
              greeting={t('common.welcomeBack')}
            />
          )}
          <PageContent className={cn(!showBottomNav && 'pb-4')}>{children}</PageContent>
        </div>

        {showBottomNav && (
          <AppBottomNav currentPage={currentPage} onNavigate={onNavigate} />
        )}
      </div>
    </PageHeaderProvider>
  )
}
